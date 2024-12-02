import { SetMetadata } from '@nestjs/common';
import { Role } from '@src/shared/enums/roles.enum';
import { ROLES_KEY } from '@auth/constants/key-decorators';

export const Roles = (...roles: Array<keyof typeof Role>) =>
  SetMetadata(ROLES_KEY, roles);
