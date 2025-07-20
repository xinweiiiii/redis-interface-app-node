import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async login(username: string, userId: string) {
    const payload = { username, sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}