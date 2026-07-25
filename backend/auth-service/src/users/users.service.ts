import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(data: any): Promise<User> {
    return this.usersRepository.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findById(id);
  }
}