import { Controller, Body, Post, UsePipes, ValidationPipe, BadRequestException, Get, Param, UseGuards, Req, UploadedFile, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './DTO/register-user.dto';
import { ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from './DTO/login-user.dto';
import { FastifyRequest } from 'fastify';
import { User } from '../entity/User.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) { };
  
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiCreatedResponse({ description: 'Created.'})
  @ApiBadRequestResponse({description: 'Username existed.'})
  async register(@Body() registerUserDto: RegisterUserDto) {
    const res = await this.userService.register(registerUserDto.username, registerUserDto.password, registerUserDto.email);
    if (!res) {
      throw new BadRequestException('Username existed.');
    }
    return {
      message: 'Created.'
    }
  }

  
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard('local'))
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  async login(@Body() loginUserDto: LoginUserDto, @Req() req: FastifyRequest) {
    const jwt = await this.authService.getJwt((req as any).user);
    return { jwt };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Req() req) {
    return req.user as User;
  }

  @Get('verify/:code')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ description: 'Verify success.' })
  @ApiBadRequestResponse({ description: 'This code has been used or not exist.' })
  async verify(@Param() params: { code: string }) {
    const r = await this.userService.verify(params.code);
    if (!r)
      throw new BadRequestException('This code has been used or not exist.');
    return { message: 'Verify success.' };
  }
}
