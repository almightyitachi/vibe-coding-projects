import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateTaskDto } from './dto/create-task.dto';

/**
 * Task business logic. Illustrative implementation showing the production
 * patterns: workspace scoping, per-project sequential numbering, transactional
 * writes with an audit-log side-effect, and status-transition rules.
 */
@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: { workspaceId: string; sprintId?: string; assigneeId?: string; status?: string }) {
    return this.prisma.task.findMany({
      where: {
        project: { workspaceId: params.workspaceId },
        sprintId: params.sprintId,
        assigneeId: params.assigneeId,
        status: params.status as any,
      },
      include: { assignee: true, tags: { include: { tag: true } } },
      orderBy: [{ status: 'asc' }, { boardRank: 'asc' }],
    });
  }

  async create(actorId: string, dto: CreateTaskDto) {
    return this.prisma.$transaction(async (tx) => {
      // Sequential per-project number → renders as KEY-number (e.g. MOB-142).
      const last = await tx.task.findFirst({
        where: { projectId: dto.projectId },
        orderBy: { number: 'desc' },
        select: { number: true },
      });
      const number = (last?.number ?? 0) + 1;

      const task = await tx.task.create({
        data: {
          number,
          title: dto.title,
          description: dto.description,
          projectId: dto.projectId,
          sprintId: dto.sprintId,
          assigneeId: dto.assigneeId,
          reporterId: actorId,
          priority: (dto.priority as any) ?? 'MEDIUM',
          designStage: dto.designStage as any,
          points: dto.points ?? 0,
          figmaUrl: dto.figmaUrl,
        },
      });

      await tx.activityLog.create({
        data: { verb: 'CREATED', entityType: 'Task', entityId: task.id, actorId },
      });

      return task;
    });
    // Post-commit side-effects (search index, notification fan-out, WS emit)
    // are enqueued by an interceptor — see docs/10-backend-architecture.md.
  }

  private static readonly FLOW = [
    'BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'APPROVED', 'DONE',
  ] as const;

  /** Approval gate: reaching APPROVED requires an approver capability upstream. */
  canTransition(from: string, to: string): boolean {
    const f = TaskService.FLOW.indexOf(from as any);
    const t = TaskService.FLOW.indexOf(to as any);
    return f !== -1 && t !== -1; // any move allowed; guard enforces approval rights
  }
}
