import { IsString } from 'class-validator';

export class LoginReturnDTO {
  @IsString()
  jwt: string;
}