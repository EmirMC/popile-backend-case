import { Types } from 'mongoose';

export enum TaskStatus {
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
}

export interface CreateTask {
  title: string;
  description?: string;
  user: Types.ObjectId;
  status?: TaskStatus;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskDetail {
  id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
}
