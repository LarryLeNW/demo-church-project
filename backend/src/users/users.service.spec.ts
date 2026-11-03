import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';
import { Role } from '../common/enums/role.enum.js';

describe('UsersService', () => {
  let usersService: UsersService;
  let repo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    repo = {
      create: vi.fn((dto) => dto),
      save: vi.fn((user) => Promise.resolve({ id: 'uuid-123', ...user })),
      findOne: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('creates and saves a student user with trimmed lowercase email', async () => {
      const user = await usersService.create({
        email: ' Student@Example.COM ',
        passwordHash: 'hashed_password',
        fullName: '  Nguyen Van A  ',
      });

      expect(user.email).toBe('student@example.com');
      expect(user.fullName).toBe('Nguyen Van A');
      expect(user.role).toBe(Role.Member);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('existsByEmail', () => {
    it('returns true when user exists', async () => {
      repo.count.mockResolvedValue(1);
      const exists = await usersService.existsByEmail('student@example.com');
      expect(exists).toBe(true);
      expect(repo.count).toHaveBeenCalledWith({
        where: { email: 'student@example.com' },
      });
    });

    it('returns false when user does not exist', async () => {
      repo.count.mockResolvedValue(0);
      const exists = await usersService.existsByEmail('none@example.com');
      expect(exists).toBe(false);
    });
  });
});
