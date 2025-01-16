import { SetMetadata } from '@nestjs/common';

export type ACCESS_ROLE = 'PUBLIC' | 'USER' | 'OPTIONAL';

export const Roles = (role?: ACCESS_ROLE) =>
  SetMetadata('ROLE', role || 'USER');
