import { Injectable } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { Role } from '@shared/enums/roles.enum';

@Injectable()
export class SeederService {
  constructor(private readonly userService: UsersService) {}

  async seedAdminUser() {
    const existingAdmin = await this.userService.findByField(
      'role',
      Role.ADMIN,
    );

    if (!existingAdmin) {
      const adminUser = {
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        username: process.env.ADMIN_USERNAME || 'Admin',
        password: process.env.ADMIN_PASSWORD || 'SecurePassword213$',
        firstName: 'Default',
        lastName: 'Admin',
        role: Role.ADMIN,
      };
      await this.userService.createUser(adminUser);
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
  }
}
