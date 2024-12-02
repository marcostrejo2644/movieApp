import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '@users/model/user.schema';
import { UsersService } from '@users/users.service';
import { AuthResponse, PayloadToken } from '@auth/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  public async validateUser(
    username: string,
    password: string,
  ): Promise<User | null> {
    const userByUsername = await this.userService.findByField(
      'username',
      username,
    );
    const userByEmial = await this.userService.findByField('email', username);

    if (userByUsername) {
      const match = await bcrypt.compare(password, userByUsername.password);
      if (match) return userByUsername;
    }

    if (userByEmial) {
      const match = await bcrypt.compare(password, userByEmial.password);
      if (match) return userByEmial;
    }

    return null;
  }

  public signJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: number | string;
  }): string {
    return jwt.sign(payload, secret, { expiresIn: expires });
  }

  public async generateJWT(user: User): Promise<AuthResponse> {
    const getUser = await this.userService.findById(user._id);

    const payload: PayloadToken = {
      role: getUser.role,
      sub: getUser._id,
    };

    return {
      accessToken: this.signJWT({
        payload,
        secret: process.env.JWT_SECRET || 'secretKey',
        expires: '1h',
      }),
      user,
    };
  }
}
