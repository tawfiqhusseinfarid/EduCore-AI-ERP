import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';

import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [

    ConfigModule.forRoot({

      isGlobal: true,

      load: [appConfig],

    }),

    PrismaModule,

    AuthModule,

    UsersModule,

  ],

})
export class AppModule {}