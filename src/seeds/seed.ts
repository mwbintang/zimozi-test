import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { User, Task, TaskHistory, TaskComment, Notification, UserTask } from '../models';

dotenv.config();
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/task_management';

const program = new Command();

const loadJSON = (filename: string) => {
  const filePath = path.join(__dirname, `./${filename}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    console.log('Existing data cleared');

    // Load and insert seed data
    const users = loadJSON('users');

    await User.insertMany(users);
    console.log('Users seeded');

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    mongoose.disconnect();
  }
};

// CLI Command Setup
program
  .command('seed')
  .description('Seed the database with initial data')
  .action(seedDatabase);

program.parse(process.argv);
