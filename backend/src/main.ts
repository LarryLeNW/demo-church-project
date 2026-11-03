import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { EnvironmentVariables, NodeEnv } from './config/env.validation.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService<EnvironmentVariables, true>);
  const logger = new Logger('TeacherLMS');

  const prefix = config.get('API_PREFIX', { infer: true });
  const port = config.get('PORT', { infer: true });
  const origins = config
    .get('CORS_ORIGIN', { infer: true })
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.setGlobalPrefix(prefix);
  app.enableCors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin) return callback(null, true);
      if (origins.includes(requestOrigin)) {
        return callback(null, true);
      }
      try {
        const hostname = new URL(requestOrigin).hostname;
        if (/^(localhost|127\.0\.0\.1)$/i.test(hostname)) {
          return callback(null, true);
        }
      } catch {
        // bỏ qua URL không hợp lệ
      }
      return callback(null, false);
    },
    credentials: true,
  });
  app.enableShutdownHooks();

  // Khởi tạo tài liệu API Swagger ở môi trường phát triển
  if (config.get('NODE_ENV', { infer: true }) !== NodeEnv.Production) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Church LMS & Discipleship API')
        .setDescription(
          'API hệ thống Quản trị Hội thánh, Đào tạo Môn đồ hóa, Trường Chúa Nhật & Dâng hiến trực tuyến (US Market)',
        )
        .setVersion('1.0')
        .addBearerAuth()
        .build(),
    );
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(port);
  logger.log(
    `API sẵn sàng tại http://localhost:${port}/${prefix} (Swagger Docs: http://localhost:${port}/docs)`,
  );
}

await bootstrap();
