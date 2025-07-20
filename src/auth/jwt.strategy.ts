import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Use process.env.JWT_SECRET in real apps 
      // TODO: Change this to use a asymmetric key in production
    });
  }

  async validate(payload: any) {
    // The returned object will be assigned to req.user
    return { userId: payload.sub, username: payload.username };
  }
}