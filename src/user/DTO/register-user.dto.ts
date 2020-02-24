import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly password: string;

  @IsEmail()
  @ApiProperty({
    format: 'email'
  })
  readonly email: string;
}
