import { UserRole } from '@prisma/client';

export class UserResponseDto {
  id: number;
  active: boolean;
  fullName: string;
  email: string;
  role: UserRole;
  entryDate: Date;
}