import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from '@users/model/user.schema';
import { UsersController } from '@users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '@users/user.repository';
import { SeederService } from './seeder.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UserRepository, SeederService],
  controllers: [UsersController],
  exports: [UsersService, UserRepository, SeederService],
})
export class UsersModule {}
