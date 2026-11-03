import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

const toBoolean = ({ value }: { value: unknown }) =>
  value === true || value === 'true' || value === '1';

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 4000;

  @IsString()
  API_PREFIX = 'api';

  @IsString()
  CORS_ORIGIN = 'http://localhost:3000';

  @IsString()
  DB_HOST = 'localhost';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  DB_PORT = 3306;

  @IsString()
  DB_USERNAME = 'root';

  @IsOptional()
  @IsString()
  DB_PASSWORD = '';

  @IsString()
  DB_NAME = 'teacher_lms';

  @Transform(toBoolean)
  @IsBoolean()
  DB_SYNCHRONIZE = true;

  @Transform(toBoolean)
  @IsBoolean()
  DB_LOGGING = false;

  @IsString()
  @MinLength(32)
  JWT_ACCESS_SECRET = 'super_secret_teacher_access_key_min_32_characters_12345';

  @IsString()
  JWT_ACCESS_EXPIRES_IN = '15m';

  @IsString()
  @MinLength(32)
  JWT_REFRESH_SECRET = 'super_secret_teacher_refresh_key_min_32_characters_67890';

  @IsString()
  JWT_REFRESH_EXPIRES_IN = '7d';

  @IsOptional()
  @IsString()
  ADMIN_EMAIL?: string;

  @IsOptional()
  @IsString()
  ADMIN_PASSWORD?: string;

  @IsOptional()
  @IsString()
  ADMIN_NAME?: string;

  @IsOptional()
  @IsString()
  STRIPE_SECRET_KEY?: string;

  @IsOptional()
  @IsString()
  STRIPE_WEBHOOK_SECRET?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Cấu hình biến môi trường không hợp lệ:\n${errors.toString()}`);
  }
  return validatedConfig;
}
