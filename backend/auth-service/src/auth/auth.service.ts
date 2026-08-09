import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

import { SuccessResponse } from '../common/response/success-response';
import { UserMapper } from '../common/mappers/user.mapper';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
  private readonly usersService: UsersService,
  private readonly jwtService: JwtService,
  private readonly configService: ConfigService,
  private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  // ==========================
  // Register
  // ==========================

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

    return new SuccessResponse(
      'User registered successfully',
      UserMapper.toResponse(user),
    );
  }

  // ==========================
  // Login
  // ==========================

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    if (!user.active) {
      throw new UnauthorizedException(
        'User account is inactive',
      );
    }

    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
  sub: user.id,
  email: user.email,
  role: user.role,
};

const accessToken = await this.jwtService.signAsync(
  payload,
);

const refreshToken = await this.jwtService.signAsync(
  payload,
  {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any,
  },
);

const refreshTokenHash = crypto
  .createHash('sha256')
  .update(refreshToken)
  .digest('hex');

const refreshExpiresIn = 7 * 24 * 60 * 60 * 1000;

await this.refreshTokenRepository.create({
  tokenHash: refreshTokenHash,
  expiresAt: new Date(Date.now() + refreshExpiresIn),
  user: {
    connect: {
      id: user.id,
    },
  },
});

return new SuccessResponse(
  'Login successful',
  {
    accessToken,
    refreshToken,
    user: UserMapper.toResponse(user),
  },
);
}
async refresh(refreshToken: string) {
  const tokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  const storedToken =
    await this.refreshTokenRepository.findByTokenHash(
      tokenHash,
    );

  if (!storedToken) {
    throw new UnauthorizedException(
      'Invalid refresh token',
    );
  }

  if (storedToken.expiresAt < new Date()) {
    await this.refreshTokenRepository.revoke(
      storedToken.id,
    );

    throw new UnauthorizedException(
      'Refresh token expired',
    );
  }

  const user = await this.usersService.findById(
    storedToken.userId,
  );

  if (!user) {
    throw new UnauthorizedException(
      'User not found',
    );
  }

  if (!user.active) {
    throw new UnauthorizedException(
      'User account is inactive',
    );
  }

  try {
    await this.jwtService.verifyAsync(
      refreshToken,
      {
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );
  } catch {
    await this.refreshTokenRepository.revoke(
      storedToken.id,
    );

    throw new UnauthorizedException(
      'Invalid refresh token',
    );
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken =
    await this.jwtService.signAsync(payload);

  const newRefreshToken =
    await this.jwtService.signAsync(
      payload,
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn:
          process.env.JWT_REFRESH_EXPIRES_IN as any,
      },
    );

  const newRefreshTokenHash = crypto
    .createHash('sha256')
    .update(newRefreshToken)
    .digest('hex');

  const refreshExpiresIn =
    7 * 24 * 60 * 60 * 1000;

  await this.refreshTokenRepository.revoke(
    storedToken.id,
  );

  await this.refreshTokenRepository.create({
    tokenHash: newRefreshTokenHash,
    expiresAt: new Date(
      Date.now() + refreshExpiresIn,
    ),
    user: {
      connect: {
        id: user.id,
      },
    },
  });

  return new SuccessResponse(
    'Token refreshed successfully',
    {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: UserMapper.toResponse(user),
    },
  );
}

async logout(refreshToken: string) {
  const tokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  const revokedToken =
    await this.refreshTokenRepository.revokeByTokenHash(
      tokenHash,
    );

  if (!revokedToken) {
    throw new UnauthorizedException(
      'Invalid refresh token',
    );
  }

  return new SuccessResponse(
    'Logout successful',
    null,
  );
}
}