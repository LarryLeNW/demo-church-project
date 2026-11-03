import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { EnvironmentVariables } from '../config/env.validation.js';
import { Role } from '../common/enums/role.enum.js';
import { UsersService } from './users.service.js';

export const PASSWORD_SALT_ROUNDS = 12;

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  async onApplicationBootstrap() {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    const adminPassword = this.config.get<string>('ADMIN_PASSWORD');
    const adminName = this.config.get<string>('ADMIN_NAME');

    if (!adminEmail || !adminPassword) {
      return;
    }

    try {
      const exists = await this.usersService.existsByEmail(adminEmail);
      if (!exists) {
        const passwordHash = await bcrypt.hash(adminPassword, PASSWORD_SALT_ROUNDS);
        await this.usersService.create({
          email: adminEmail,
          passwordHash,
          fullName: adminName || 'Senior Pastor / Mục Sư Quản Nhiệm',
          role: Role.SeniorPastor,
        });
        this.logger.log(`Tài khoản Senior Pastor khởi tạo thành công: ${adminEmail}`);
      }
    } catch (error) {
      this.logger.warn(`Không thể khởi tạo tài khoản Admin: ${(error as Error).message}`);
    }
  }
}
