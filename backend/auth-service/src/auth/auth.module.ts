import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,

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

  providers: [AuthService],

  exports: [JwtModule],
})
export class AuthModule {}