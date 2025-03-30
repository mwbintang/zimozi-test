import { UserTask, Task } from '../models';
import { UserRole } from '../constants/roles';
import { offset, paginationData } from '../helpers/pagination';
import { createTaskHistory } from '../utils/task_history';
import { invalidateCache, setRedisCache, getRedisCache } from '../helpers/redis';
import { addNotificationJob } from '../queues/notification_queue';

export const getUserTasks = async (userId: string, user: any, page: string, limit: string) => {
    if (user.role == UserRole.USER && user.id != userId) {
        throw new Error('FORBIDDEN')
    }

    const cachedTasks = await getRedisCache(`tasks:${userId},${page},${limit}`);
    if (cachedTasks) {
        return cachedTasks;
    }

    // Convert query params to numbers
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = offset(pageNumber, limitNumber);

    // Find all tasks where the user is assigned
    const userTasks = await UserTask.find({ userId }).select("taskId");
    const taskIds = userTasks.map((ut) => ut.taskId);

    // Fetch tasks with pagination
    const tasks = await Task.find({ _id: { $in: taskIds } })
        .skip(skip)
        .limit(limitNumber);

    // Count total tasks for pagination
    const totalTasks = await Task.countDocuments({ _id: { $in: taskIds } });

    const taskPaginationData = paginationData(tasks, totalTasks, pageNumber, limitNumber);
    await setRedisCache(`tasks:${userId},${page},${limit}`, taskPaginationData);

    return taskPaginationData;
}

export const getTaskById = async (id: string, user: any) => {
    const cachedTask = await getRedisCache(`task:${id}`);
    if (cachedTask) {
        return cachedTask;
    }

    const task: any = await Task.findOne({ _id: id }).populate("createdBy")
        .populate({
            path: "assignedUsers",
            model: "user_task",
            populate: {
                path: "userId",
                model: "user",
            },
        })
        .populate({
            path: "comments",
            model: "task_comment",
            populate: {
                path: "userId",
                model: "user",
            },
        })
        .populate({
            path: "history",
            model: "task_history",
        })
        .exec();

    if (!task) {
        throw new Error('NOT_FOUND')
    }

    if (user.role == UserRole.USER && task.createdBy != user.id) {
        const isUser = task.assignedUsers.some((user: any) => user.userId._id === user.id);
        if (!isUser) {
            throw new Error('FORBIDDEN')
        }
    }

    await setRedisCache(`task:${id}`, task);

    return task;
}

export const createTask = async (title: string, description: string, status: string, dueDate: Date, assignedTo: string[] | null, user: any) => {
    const task = await Task.create({
        title,
        description,
        status,
        dueDate,
        createdBy: user.id
    })

    let assignedToFormated: any
    if (!assignedTo) {
        assignedToFormated = [
            {
                userId: user.id,
                taskId: task._id
            }
        ]
    } else {
        assignedToFormated = assignedTo.map((userId: string) => {
            return {
                userId: userId,
                taskId: task._id
            }
        })
    }

    await UserTask.insertMany(assignedToFormated)

    await createTaskHistory(task._id, user.id, status)
    await addNotificationJob(user.id, "Your tasks have been updated!");

    const response = await Task.findOne({ _id: task.id })
        .populate("createdBy")
        .populate({
            path: "assignedUsers",
            model: "user_task",
            populate: {
                path: "userId",
                model: "user",
            },
        })
        .exec();

    await invalidateCache("tasks:*");
    await setRedisCache(`task:${task._id}`, response);

    return response
}

export const updateTask = async (
    taskId: string,
    title: string,
    description: string,
    status: string,
    dueDate: Date,
    assignedTo: string[] | null,
    user: any
) => {
    // Update Task Fields
    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { title, description, status, dueDate },
        { new: true, runValidators: true }
    );

    if (!updatedTask) {
        throw new Error("Task not found");
    }

    // Remove existing assignments for this task
    await UserTask.deleteMany({ taskId });

    // Assign new users if provided
    let assignedToFormatted: any;
    if (assignedTo && assignedTo.length > 0) {
        assignedToFormatted = assignedTo.map((userId: string) => ({
            userId,
            taskId: updatedTask._id
        }));
    } else {
        assignedToFormatted = [{ userId: updatedTask.createdBy, taskId: updatedTask._id }];
    }

    await UserTask.insertMany(assignedToFormatted);

    await createTaskHistory(updatedTask._id, user.id, status)

    // Fetch the updated task with populated users
    const response = await Task.findOne({ _id: updatedTask.id })
        .populate("createdBy")
        .populate({
            path: "assignedUsers",
            model: "user_task",
            populate: {
                path: "userId",
                model: "user",
            },
        })
        .exec();

    await invalidateCache("tasks:*");
    await setRedisCache(`task:${updatedTask._id}`, response);

    return response;
};

export const deleteTask = async (id: string) => {
    await invalidateCache("tasks:*");
    await invalidateCache(`task:${id}`);
    
    return Task.findOneAndDelete({ _id: id });
}