import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { TaskStatus } from './task.interface';

export type TaskDocument = mongoose.HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, enum: TaskStatus, default: 'todo' })
  status: TaskStatus;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({ default: mongoose.now() })
  createdAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
