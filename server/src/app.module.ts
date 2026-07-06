import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './prisma/prisma.service';
import { RolesGuard } from './common/guards/roles.guard';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';

/**
 * Root module. In production this composes every feature module
 * (Workspace, Project, Sprint, Task, Document, Review, Notification, Activity,
 * Search, Upload, Realtime, Ai). The Task module is wired here as a reference.
 * See docs/10-backend-architecture.md and docs/13-folder-structure.md.
 */
@Module({
  controllers: [TaskController],
  providers: [
    PrismaService,
    TaskService,
    // AuthGuard would be the first global guard; RolesGuard enforces capabilities.
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
