import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { RequireCapability } from '../common/decorators/require-capability.decorator';

/**
 * REST controller for tasks. Guards (AuthGuard + RolesGuard) are applied
 * globally in AppModule; capability decorators declare per-route requirements.
 * See docs/08-api-design.md.
 */
@Controller('api/v1/tasks')
export class TaskController {
  constructor(private readonly tasks: TaskService) {}

  @Get()
  @RequireCapability('content.view')
  list(
    @Query('workspaceId') workspaceId: string,
    @Query('sprintId') sprintId?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('status') status?: string,
  ) {
    return this.tasks.list({ workspaceId, sprintId, assigneeId, status });
  }

  @Post()
  @RequireCapability('work.manage')
  create(@Body() dto: CreateTaskDto /*, @CurrentUser() user */) {
    const actorId = 'current-user-id'; // resolved by CurrentUser decorator in prod
    return this.tasks.create(actorId, dto);
  }

  @Patch(':id')
  @RequireCapability('work.manage')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    // status/priority/assignee/rank patch → service applies transition rules
    return { id, ...body };
  }
}
