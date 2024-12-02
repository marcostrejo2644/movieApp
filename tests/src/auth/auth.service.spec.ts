import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@auth/auth.service';
import { UsersService } from '@users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '@users/model/user.schema';
import { Role } from '@src/shared/enums/roles.enum';

jest.mock('@users/users.service');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const mockUser: User = {
    _id: '123',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: Role.USER,
    createdAt: new Date(),
    isDeleted: false,
    firstName: 'test',
    lastName: 'test',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('validateUser', () => {
    it('should return a user when username and password are valid', async () => {
      jest.spyOn(usersService, 'findByField').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const result = await authService.validateUser(
        mockUser.username,
        'validPassword',
      );

      expect(result).toEqual(mockUser);
      expect(usersService.findByField).toHaveBeenCalledWith(
        'username',
        mockUser.username,
      );
    });

    it('should return null when username or password are invalid', async () => {
      jest.spyOn(usersService, 'findByField').mockResolvedValueOnce(null);

      const result = await authService.validateUser(
        'invalidUsername',
        'invalidPassword',
      );

      expect(result).toBeNull();
    });

    it('should return a user when email and password are valid', async () => {
      jest.spyOn(usersService, 'findByField').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const result = await authService.validateUser(
        mockUser.email,
        'validPassword',
      );

      expect(result).toEqual(mockUser);
      expect(usersService.findByField).toHaveBeenCalledWith(
        'email',
        mockUser.email,
      );
    });
  });

  describe('generateJWT', () => {
    it('should generate a JWT and return the accessToken and user', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValueOnce(mockUser);
      jest.spyOn(authService, 'signJWT').mockReturnValue('signedJWT');

      const result = await authService.generateJWT(mockUser);

      expect(result).toEqual({
        accessToken: 'signedJWT',
        user: mockUser,
      });
      expect(usersService.findById).toHaveBeenCalledWith(mockUser._id);
    });
  });
});
