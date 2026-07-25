import { Module } from '@nestjs/common';

import { PrismaModule } from '../common/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],

  controllers: [UsersController],

  providers: [
    UsersService,
    UsersRepository,
  ],

  exports: [
  UsersRepository,
  UsersService,
],
})
export class UsersModule {}