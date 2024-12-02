import { Role } from '@src/shared/enums/roles.enum';

export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  createdAt?: Date;
}

export interface IUpdateUser {
  _id?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}
