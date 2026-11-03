import {
  BadRequestException,
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import type { ValidationError } from 'class-validator';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { validateEnv } from './config/env.validation.js';
import { DatabaseModule } from './database/database.module.js';
import { GroupsModule } from './groups/groups.module.js';
import { CoursesModule } from './courses/courses.module.js';
import { DonationsModule } from './donations/donations.module.js';
import { PrayersModule } from './prayers/prayers.module.js';
import { ScriptureModule } from './scripture/scripture.module.js';
import { BibleModule } from './bible/bible.module.js';
import { CommunicationsModule } from './communications/communications.module.js';
import { ChildrenModule } from './children/children.module.js';
import { UsersModule } from './users/users.module.js';
import { PathwayModule } from './pathway/pathway.module.js';
import { VolunteersModule } from './volunteers/volunteers.module.js';
import { EventsModule } from './events/events.module.js';
import { SermonsModule } from './sermons/sermons.module.js';
import { PastoralModule } from './pastoral/pastoral.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { FacilitiesModule } from './facilities/facilities.module.js';

function validationErrorPaths(errors: ValidationError[], parent = ''): string[] {
  return errors.flatMap((error) => {
    const path = parent ? `${parent}.${error.property}` : error.property;
    const childPaths = validationErrorPaths(error.children ?? [], path);
    return childPaths.length ? childPaths : [path];
  });
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      validate: validateEnv,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    GroupsModule,
    CoursesModule,
    DonationsModule,
    PrayersModule,
    ScriptureModule,
    BibleModule,
    CommunicationsModule,
    ChildrenModule,
    PathwayModule,
    VolunteersModule,
    EventsModule,
    SermonsModule,
    PastoralModule,
    AnalyticsModule,
    FacilitiesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: false },
        exceptionFactory: (errors) =>
          new BadRequestException(
            `Dữ liệu không hợp lệ: ${[...new Set(validationErrorPaths(errors))].join(', ')}`,
          ),
      }),
    },
    // Chuẩn hóa lỗi DB/hệ thống thành HTTP chuẩn + thông báo tiếng Việt, không lộ SQL.
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    // Tự động loại bỏ các trường @Exclude() (passwordHash, refreshTokenHash) trong response.
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    // Bảo vệ mặc định: JwtAuthGuard xác thực token -> RolesGuard kiểm tra phân quyền.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
