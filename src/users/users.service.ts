import { ConflictException, Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { User } from './model/user.schema';
import { UserRepository } from './user.repository';
import { Role } from '@src/shared/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: IUser, isAdmin: boolean = false): Promise<User> {
    const isEmailAlreadyInUse = await this.userRepository.findByField(
      'email',
      user.email,
    );
    const isUsernameAlreadyInUse = await this.userRepository.findByField(
      'username',
      user.username,
    );
    if (isEmailAlreadyInUse || isUsernameAlreadyInUse) {
      throw new ConflictException('User already exist');
    }
    if (isAdmin) {
      user.role = Role.ADMIN;
    }

    return await this.userRepository.create(user);
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async findByField(field: keyof User, user: string): Promise<User> {
    return await this.userRepository.findByField(field, user);
  }

  async updateUser(userId: string, user: Partial<IUser>): Promise<User | null> {
    return await this.userRepository.updateById(userId, user);
  }

  async toggleUserStatus(userId: string): Promise<User> {
    return await this.userRepository.toggleUserStatus(userId);
  }
}
