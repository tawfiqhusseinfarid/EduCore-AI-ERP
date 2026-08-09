import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('app.jwt.secret'),

        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'app.jwt.expiresIn',
          ) as any,
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
  AuthService,
  RefreshTokenRepository,
  JwtStrategy,
],

  exports: [JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}