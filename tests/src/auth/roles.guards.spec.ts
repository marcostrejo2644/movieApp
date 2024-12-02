import { RolesGuard } from '@auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Role } from '@src/shared/enums/roles.enum';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      get: jest.fn(),
    } as unknown as Reflector;
    rolesGuard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  describe('canActivate', () => {
    let context: ExecutionContext;

    beforeEach(() => {
      context = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue({ roleUser: Role.USER }),
        getHandler: jest.fn().mockReturnValue('testHandler'),
      } as unknown as ExecutionContext;
    });

    it('should allow access to public routes', () => {
      (reflector.get as jest.Mock).mockReturnValueOnce(true);
      expect(rolesGuard.canActivate(context)).toBe(true);
    });

    it('should allow access if no roles are required', () => {
      (reflector.get as jest.Mock).mockReturnValueOnce(undefined);
      (reflector.get as jest.Mock).mockReturnValueOnce(undefined);
      expect(rolesGuard.canActivate(context)).toBe(true);
    });

    it('should allow access if user has valid role', () => {
      const roles = [Role.ADMIN, Role.USER];
      (reflector.get as jest.Mock).mockReturnValueOnce(roles);
      expect(rolesGuard.canActivate(context)).toBe(true);
    });
  });
});
