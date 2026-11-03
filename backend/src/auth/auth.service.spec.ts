import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { Role } from '../common/enums/role.enum.js';
import { User } from '../users/entities/user.entity.js';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: {
    existsByEmail: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    findByEmailWithSecrets: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    findByIdWithSecrets: ReturnType<typeof vi.fn>;
    updateRefreshTokenHash: ReturnType<typeof vi.fn>;
    markLogin: ReturnType<typeof vi.fn>;
  };
  let jwtService: {
    signAsync: ReturnType<typeof vi.fn>;
    verifyAsync: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    usersService = {
      existsByEmail: vi.fn(),
      create: vi.fn(),
      findByEmailWithSecrets: vi.fn(),
      findById: vi.fn(),
      findByIdWithSecrets: vi.fn(),
      updateRefreshTokenHash: vi.fn(),
      markLogin: vi.fn(),
    };

    jwtService = {
      signAsync: vi.fn().mockResolvedValue('mock-jwt-token'),
      verifyAsync: vi.fn(),
    };

    const configService = {
      get: vi.fn((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return 'super_secret_teacher_access_key_12345';
        if (key === 'JWT_REFRESH_SECRET') return 'super_secret_teacher_refresh_key_67890';
        if (key === 'JWT_ACCESS_EXPIRES_IN') return '15m';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('creates a new student and issues tokens', async () => {
      usersService.existsByEmail.mockResolvedValue(false);
      const mockUser: Partial<User> = {
        id: 'user-uuid-1',
        email: 'test@example.com',
        fullName: 'Test Student',
        role: Role.Member,
        isActive: true,
      };
      usersService.create.mockResolvedValue(mockUser);

      const result = await authService.register({
        email: 'test@example.com',
        fullName: 'Test Student',
        password: 'Password@123',
      });

      expect(result.user).toEqual(mockUser);
      expect(result.tokens.accessToken).toBe('mock-jwt-token');
      expect(result.tokens.refreshToken).toBe('mock-jwt-token');
      expect(usersService.markLogin).toHaveBeenCalledWith('user-uuid-1');
    });

    it('throws ConflictException if email exists', async () => {
      usersService.existsByEmail.mockResolvedValue(true);

      await expect(
        authService.register({
          email: 'existing@example.com',
          fullName: 'Test Student',
          password: 'Password@123',
        }),
      ).rejects.toThrow('Email này đã được đăng ký');
    });
  });
});
