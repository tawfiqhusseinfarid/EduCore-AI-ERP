import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'Md. Tawfiq Hussein Farid',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'farid@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  @IsEnum(UserRole)
  role: UserRole;
}