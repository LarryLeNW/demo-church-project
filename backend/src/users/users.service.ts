import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { Role } from '../common/enums/role.enum.js';
import { UserQueryDto } from './dto/user-query.dto.js';
import { UpdateProfileDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string | null;
    role?: Role;
  }): Promise<User> {
    const user = this.userRepository.create({
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      fullName: data.fullName.trim(),
      phone: data.phone?.trim() ?? null,
      role: data.role ?? Role.Member,
    });
    return this.userRepository.save(user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email: email.toLowerCase().trim() },
    });
    return count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findByEmailWithSecrets(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .addSelect('user.refreshTokenHash')
      .where('LOWER(user.email) = :email', { email: email.toLowerCase().trim() })
      .getOne();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  async findByIdWithSecrets(id: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .addSelect('user.refreshTokenHash')
      .where('user.id = :id', { id })
      .getOne();
  }

  async updateRefreshTokenHash(id: string, hash: string | null): Promise<void> {
    await this.userRepository.update(id, { refreshTokenHash: hash });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.userRepository.update(id, {
      passwordHash,
      refreshTokenHash: null, // Đổi mật khẩu hủy toàn bộ phiên refresh token cũ
    });
  }

  async updateRole(id: string, role: Role): Promise<User> {
    const user = await this.findById(id);
    user.role = role;
    return this.userRepository.save(user);
  }

  async updateStatus(id: string, isActive: boolean): Promise<User> {
    const user = await this.findById(id);
    user.isActive = isActive;
    return this.userRepository.save(user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(id);
    if (dto.fullName) user.fullName = dto.fullName.trim();
    if (dto.phone !== undefined) user.phone = dto.phone?.trim() ?? null;
    if (dto.avatarUrl !== undefined) user.avatarUrl = dto.avatarUrl;
    return this.userRepository.save(user);
  }

  async markLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async findAll(query: UserQueryDto) {
    const { page = 1, limit = 20, search, role } = query;
    const qb = this.userRepository.createQueryBuilder('user');

    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    if (search) {
      qb.andWhere(
        '(LOWER(user.fullName) LIKE :search OR LOWER(user.email) LIKE :search OR user.phone LIKE :search)',
        { search: `%${search.toLowerCase().trim()}%` },
      );
    }

    qb.orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
