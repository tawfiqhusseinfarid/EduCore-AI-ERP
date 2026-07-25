import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../common/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException(
        'Email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    const user = await this.usersService.createUser({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });

    const { password, ...userData } = user;

    return {
    success: true,
    message: 'User registered successfully',
    data: userData,
    };

  }
}