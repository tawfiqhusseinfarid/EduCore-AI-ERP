import {Controller,Get,Req,UseGuards,} from '@nestjs/common';

import {ApiBearerAuth,ApiOperation,ApiTags,} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Current Logged-in User',
  })
  getMe(@Req() req: any) {
    return {
      success: true,
      message: 'Current user fetched successfully',
      data: req.user,
    };
  }
}