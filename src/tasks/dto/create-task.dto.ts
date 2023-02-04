import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../task.interface';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string | null;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be ' + Object.values(TaskStatus).join(', '),
  })
  status?: TaskStatus | null;
}
