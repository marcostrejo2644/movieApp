import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from './model/user.schema';
import { UserDTO, UpdateUserDTO } from './model/user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@src/auth/guards/auth.guard';
import { PublicAccess } from '@src/auth/decorators/public.decorator';
import { AdminAccess } from '@src/auth/decorators/admin.decorator';
import { IdParamDTO } from '@src/shared/mongoId.dto';
import { Role } from '@src/shared/enums/roles.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @PublicAccess()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: UserDTO })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createUser(@Body() user: UserDTO): Promise<User> {
    return await this.usersService.createUser(user);
  }

  @Post('/create-admin')
  @AdminAccess()
  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiBody({ type: UserDTO })
  @ApiResponse({
    status: 201,
    description: 'Admin user successfully created',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAdmin(@Body() user: UserDTO): Promise<User> {
    const isAdmin = true;
    return await this.usersService.createUser(user, isAdmin);
  }

  @Get()
  @ApiOperation({ summary: 'Get user By Id' })
  @ApiResponse({
    status: 200,
    description: 'User data successfully updated',
    type: User,
  })
  async getUserById(@Request() req: any): Promise<User> {
    const userId = req.userId;
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Put()
  @ApiOperation({ summary: 'Update the user data' })
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({
    status: 200,
    description: 'User data successfully updated',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateUser(
    @Request() req: any,
    @Body() user: UpdateUserDTO,
  ): Promise<User> {
    const userId = req.userId;
    const userUpdate = await this.usersService.updateUser(userId, user);

    if (!userUpdate) {
      throw new Error('Something went wrong');
    }
    return userUpdate;
  }

  @Patch('/activate/:id')
  @AdminAccess()
  @ApiOperation({ summary: 'Activate a user account' })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'User account successfully activated',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async activateUser(
    @Param() id: IdParamDTO,
    @Request() req: any,
  ): Promise<User> {
    const userId = req.userId;
    const userUpdate = await this.usersService.toggleUserStatus(userId);
    if (!userUpdate) {
      throw new Error('Cannot activate user');
    }
    return userUpdate;
  }

  @Delete()
  @ApiOperation({ summary: 'Deactivate the user account' })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'User account successfully deactivated',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async desactivateUser(@Request() req: any): Promise<User> {
    const userId = req.userId;
    const userUpdate = await this.usersService.toggleUserStatus(userId);
    if (!userUpdate) {
      throw new Error('Cannot desactivate user');
    }
    return userUpdate;
  }
}
