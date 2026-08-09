import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma, RefreshToken } from '@prisma/client';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.RefreshTokenCreateInput,
  ): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async findByTokenHash(
    tokenHash: string,
  ): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revoked: false,
      },
    });
  }

  async revoke(id: number): Promise<RefreshToken> {
    return this.prisma.refreshToken.update({
      where: {
        id,
      },
      data: {
        revoked: true,
      },
    });
  }

  async revokeAllByUserId(userId: number) {
    return this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revoked: false,
      },
      data: {
        revoked: true,
      },
    });
  }

  async revokeByTokenHash(
  tokenHash: string,
): Promise<RefreshToken | null> {
  const refreshToken =
    await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
      },
    });

  if (!refreshToken) {
    return null;
  }

  return this.prisma.refreshToken.update({
    where: {
      id: refreshToken.id,
    },
    data: {
      revoked: true,
    },
  });
}
}