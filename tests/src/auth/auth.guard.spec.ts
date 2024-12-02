import { AuthGuard } from '@auth/guards/auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { useToken } from '@utils/useToken';

jest.mock('@utils/useToken', () => ({
  useToken: jest.fn(),
}));

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let reflector: Reflector;
  let userService: UsersService;

  beforeEach(() => {
    userService = { findById: jest.fn() } as unknown as UsersService;
    reflector = { get: jest.fn() } as unknown as Reflector;
    authGuard = new AuthGuard(userService, reflector);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe('canActivate', () => {
    let context: ExecutionContext;

    beforeEach(() => {
      context = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer valid-token' },
        }),
        getHandler: jest.fn().mockReturnValue('testHandler'),
      } as unknown as ExecutionContext;
    });

    it('should throw UnauthorizedException if token is expired', async () => {
      (useToken as jest.Mock).mockReturnValueOnce({ isExpired: true });

      await expect(authGuard.canActivate(context)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user does not exist or is deleted', async () => {
      (useToken as jest.Mock).mockReturnValueOnce({
        isExpired: false,
        sub: 'userId',
      });
      (userService.findById as jest.Mock).mockResolvedValueOnce(null);

      await expect(authGuard.canActivate(context)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is deleted', async () => {
      const user = { _id: 'userId', isDeleted: true } as any;
      (useToken as jest.Mock).mockReturnValueOnce({
        isExpired: false,
        sub: 'userId',
      });
      (userService.findById as jest.Mock).mockResolvedValueOnce(user);

      await expect(authGuard.canActivate(context)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should allow valid user with valid token', async () => {
      const user = { _id: 'userId', isDeleted: false, role: 'USER' } as any;
      (useToken as jest.Mock).mockReturnValueOnce({
        isExpired: false,
        sub: 'userId',
      });
      (userService.findById as jest.Mock).mockResolvedValueOnce(user);

      const result = await authGuard.canActivate(context);
      expect(result).toBe(true);
    });
  });
});
