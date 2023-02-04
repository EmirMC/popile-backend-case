import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { TaskDetail, CreateTask, UpdateTask } from './task.interface';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  public async findAll(user: string): Promise<TaskDetail[]> {
    const tasks = await this.taskModel
      .find({ user: new Types.ObjectId(user) })
      .sort({ createdAt: -1 })
      .exec();
    return tasks.map((task) => this._getTaskDetail(task));
  }

  public async findById(id: string, user?: string): Promise<TaskDetail> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    if (user && !task.user.equals(user))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this._getTaskDetail(task);
  }

  public _getTaskDetail(task: TaskDocument): TaskDetail {
    return {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      user: task.user,
    };
  }

  async create(createTask: CreateTask): Promise<TaskDetail> {
    const createdTask = new this.taskModel(createTask);
    return this._getTaskDetail(await createdTask.save());
  }

  async update(id: string, updateTask: UpdateTask): Promise<TaskDetail> {
    if (Object.keys(updateTask).length === 0)
      throw new HttpException('No update data', 400);
    try {
      this.taskModel.updateOne();
      const updatedTask = await this.taskModel.findByIdAndUpdate(
        id,
        updateTask,
      );
      return Object.assign(this._getTaskDetail(updatedTask), updateTask);
    } catch (error) {
      console.log(error);
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deleted = await this.taskModel.deleteOne({
        _id: new Types.ObjectId(id),
      });
      if (deleted.deletedCount === 0)
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      console.log(error);
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }
}
