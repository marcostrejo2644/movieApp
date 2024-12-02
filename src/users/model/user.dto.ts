import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  Matches,
  IsOptional,
} from 'class-validator';
import { IUser } from '@users/interfaces/user.interface';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO implements IUser {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username must not be empty' })
  username: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'Password123!',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password must not be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/,
    {
      message:
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;
}

export class UpdateUserDTO
  implements Partial<Omit<IUser, 'email' | 'username' | 'id'>>
{
  @ApiProperty({
    description: 'First name of the user',
    example: 'Jane',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Smith',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;
}
