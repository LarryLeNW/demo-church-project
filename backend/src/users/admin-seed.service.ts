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
    const adminEmail = this.config.get<string>('ADMIN_EMAIL') || 'admin@teacher.local';
    const adminPassword = this.config.get<string>('ADMIN_PASSWORD') || 'AdminTeacher@2026';
    const adminName = this.config.get<string>('ADMIN_NAME') || 'Quản Trị Viên SAM (Admin)';

    const defaultAccounts = [
      {
        email: adminEmail,
        password: adminPassword,
        fullName: adminName,
        role: Role.Admin,
      },
      {
        email: 'user@teacher.local',
        password: 'AdminTeacher@2026',
        fullName: 'Môn Đồ / Tín Hữu SAM (User)',
        role: Role.User,
      },
    ];

    for (const acc of defaultAccounts) {
      try {
        const exists = await this.usersService.existsByEmail(acc.email);
        if (!exists) {
          const passwordHash = await bcrypt.hash(acc.password, PASSWORD_SALT_ROUNDS);
          await this.usersService.create({
            email: acc.email,
            passwordHash,
            fullName: acc.fullName,
            role: acc.role,
          });
          this.logger.log(`Tài khoản khởi tạo thành công (${acc.role}): ${acc.email}`);
        }
      } catch (error) {
        this.logger.warn(`Không thể khởi tạo tài khoản ${acc.email}: ${(error as Error).message}`);
      }
    }
  }
}
