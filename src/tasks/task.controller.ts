import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(@Body() body: CreateTaskDto, @Request() req) {
    return this.taskService.create({ ...body, user: req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Request() req) {
    return this.taskService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findById(@Param('id') id: string, @Request() req) {
    return await this.taskService.findById(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() body: CreateTaskDto,
    @Request() req,
  ) {
    await this.taskService.findById(id, req.user.id);
    return this.taskService.update(id, { ...body });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async delete(@Param('id') id: string, @Request() req) {
    const deletedTask = await this.taskService.findById(id, req.user.id);
    await this.taskService.delete(id);
    return { deleted: deletedTask, message: 'Task deleted', type: 'success' };
  }
}
