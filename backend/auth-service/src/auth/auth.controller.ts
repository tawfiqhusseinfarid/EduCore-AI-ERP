import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register New User',
  })
  register(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.register(createUserDto);
  }

@Post('refresh')
@ApiOperation({
  summary: 'Refresh Access Token',
})
refresh(
  @Body() refreshTokenDto: RefreshTokenDto,
) {
  return this.authService.refresh(
    refreshTokenDto.refreshToken,
  );
}

@Post('logout')
@ApiOperation({
  summary: 'User Logout',
})
logout(
  @Body() logoutDto: LogoutDto,
) {
  return this.authService.logout(
    logoutDto.refreshToken,
  );
}

  @Post('login')
  @ApiOperation({
    summary: 'User Login',
  })
  login(
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }
}