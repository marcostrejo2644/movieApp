import { Role } from '@src/shared/enums/roles.enum';
import { User } from '@users/model/user.schema';

export interface PayloadToken {
  sub: string;
  role: Role;
}

export interface AuthBody {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface AuthTokenResult {
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface IUseToken {
  role: string;
  sub: string;
  isExpired: boolean;
}
