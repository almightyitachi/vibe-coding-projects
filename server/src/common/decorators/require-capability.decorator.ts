import { SetMetadata } from '@nestjs/common';
import type { Capability } from '../permissions';

export const CAPABILITY_KEY = 'capability';

/** Guard a route with a required capability, e.g. @RequireCapability('projects.create'). */
export const RequireCapability = (capability: Capability) =>
  SetMetadata(CAPABILITY_KEY, capability);
