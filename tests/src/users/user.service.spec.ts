import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@users/users.service';
import { UserRepository } from '@users/user.repository';
import { ConflictException } from '@nestjs/common';
import { User } from '@users/model/user.schema';
import { Role } from '@shared/enums/roles.enum';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    findByField: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should create a user successfully', async () => {
    const newUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      role: Role.USER,
      createdAt: new Date(),
      isDeleted: false,
    };

    mockUserRepository.findByField.mockResolvedValueOnce(null);
    mockUserRepository.findByField.mockResolvedValueOnce(null);
    mockUserRepository.create.mockResolvedValue(newUser);

    const result = await usersService.createUser(newUser, false);

    expect(result).toEqual(newUser);
    expect(mockUserRepository.create).toHaveBeenCalledWith(newUser);
  });

  it('should throw ConflictException if email is already in use', async () => {
    const newUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };

    mockUserRepository.findByField.mockResolvedValueOnce(newUser);

    await expect(usersService.createUser(newUser, false)).rejects.toThrow(
      ConflictException,
    );
    expect(mockUserRepository.findByField).toHaveBeenCalledWith(
      'email',
      newUser.email,
    );
  });

  it('should throw ConflictException if username is already in use', async () => {
    const newUser = {
      email: 'newuser@example.com',
      username: 'testuser',
      password: 'password123',
    };

    mockUserRepository.findByField.mockResolvedValueOnce(null);
    mockUserRepository.findByField.mockResolvedValueOnce(newUser);

    await expect(usersService.createUser(newUser, false)).rejects.toThrow(
      ConflictException,
    );
    expect(mockUserRepository.findByField).toHaveBeenCalledWith(
      'username',
      newUser.username,
    );
  });

  it('should assign ADMIN role if isAdmin is true', async () => {
    const newUser = {
      email: 'admin@example.com',
      username: 'adminuser',
      password: 'password123',
      createdAt: new Date(),
      isDeleted: false,
    };

    mockUserRepository.findByField.mockResolvedValueOnce(null);
    mockUserRepository.findByField.mockResolvedValueOnce(null);
    mockUserRepository.create.mockResolvedValueOnce({
      ...newUser,
      role: Role.ADMIN,
    });

    const isAdmin = true;
    const result = await usersService.createUser(newUser, isAdmin);

    expect(result.role).toBe(Role.ADMIN);
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ role: Role.ADMIN }),
    );
  });
});
