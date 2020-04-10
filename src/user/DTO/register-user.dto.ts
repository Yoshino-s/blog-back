import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  readonly username: string;

  readonly password: string;

  @IsEmail()
  @ApiProperty({
    format: 'email'
  })
  readonly email: string;
}
