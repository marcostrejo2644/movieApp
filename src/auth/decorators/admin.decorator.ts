import { SetMetadata } from '@nestjs/common';
import { ADMIN_KEY } from '@auth/constants/key-decorators';
import { Role } from '@src/shared/enums/roles.enum';

export const AdminAccess = () => SetMetadata(ADMIN_KEY, Role.ADMIN);
