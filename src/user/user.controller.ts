import { Controller, Body, Post, UsePipes, ValidationPipe, BadRequestException, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './DTO/register-user.dto';
import { ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { LoginUserDto } from './DTO/login-user-dto';
import { AuthGuard } from '@nestjs/passport';
import {FastifyRequest} from 'fastify';
import { AuthService } from '../auth/auth.service';
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
    const res = await this.userService.register(registerUserDto.name, registerUserDto.password, registerUserDto.email);
    if (!res) {
      throw new BadRequestException('Username existed.');
    }
    return {
      message: 'Created.'
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    const user = req.user as User;
    return await this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('verify/:code')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiCreatedResponse({ description: 'Verify success.' })
  @ApiBadRequestResponse({ description: 'This code has been used or not exist.' })
  async verify(@Param() params: { code: string }) {
    const r = await this.userService.verify(params.code);
    if (!r)
      throw new BadRequestException('This code has been used or not exist.');
    return { message: 'Verify success.' };
  }
}
