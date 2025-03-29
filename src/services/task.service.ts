import { UserTask, Task } from '../models';
import { UserRole } from '../constants/roles';

export const getAllTasks = async () => {
    return Task.find();
}

export const getTaskById = async (id: number, user: any) => {
    const task = await Task.findOne({ _id: id }).populate("user");
    console.log(task, 'taskkkkkk')

    if (!task) {
        throw new Error('NOT_FOUND')
    }

    if (user.role == UserRole.USER && task.createdBy != user.id) {
        throw new Error('FORBIDDEN')
    }

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

    return response
}

export const updateTask = async (
    taskId: string,
    title?: string,
    description?: string,
    status?: string,
    dueDate?: Date,
    assignedTo?: string[] | null
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

    return response;
};

export const deleteTask = async (id: number) => {
    return Task.deleteOne({ _id: id });
}