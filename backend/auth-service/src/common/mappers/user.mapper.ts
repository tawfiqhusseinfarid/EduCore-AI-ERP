import { User } from '@prisma/client';

export class UserMapper {
  static toResponse(user: User) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      active: user.active,
      entryDate: user.entryDate,
    };
  }
}