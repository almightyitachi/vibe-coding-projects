import {
  CanActivate, ExecutionContext, ForbiddenException, Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CAPABILITY_KEY } from '../decorators/require-capability.decorator';
import { can, type Capability, type Role } from '../permissions';

/**
 * Resolves the caller's workspace membership role and enforces the required
 * capability from the RBAC matrix. Row-level workspace scoping is applied in
 * services; this guard is the coarse gate. See docs/11-permissions-model.md.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Capability>(CAPABILITY_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required) return true; // no capability declared → auth-only route

    const req = ctx.switchToHttp().getRequest();
    const role: Role | undefined = req.membership?.role;
    if (!role) throw new ForbiddenException('No workspace membership');

    if (!can(role, required)) {
      throw new ForbiddenException(`Role ${role} lacks capability ${required}`);
    }
    return true;
  }
}
