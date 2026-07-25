import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { PrismaService } from './common/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get<string>('app.cors.origin'),
    credentials: true,
  });

  // Global Prefix
  const apiPrefix = configService.get<string>('app.apiPrefix');
  const apiVersion = configService.get<string>('app.apiVersion');

  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('EduCore Auth Service')
    .setDescription('Authentication Microservice API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // Prisma Shutdown
  await prismaService.enableShutdownHooks(app);

  const port = configService.get<number>('app.port') ?? 3001;

  await app.listen(port);

  console.log(
    `🚀 ${configService.get('app.name')} running on http://localhost:${port}`,
  );
  console.log(`📚 Swagger: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();