import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly password: string;
}
