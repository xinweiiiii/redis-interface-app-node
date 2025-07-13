import { IsString, MinLength } from 'class-validator';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

export class SignupDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}