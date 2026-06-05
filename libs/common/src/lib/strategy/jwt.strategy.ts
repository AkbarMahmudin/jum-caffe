import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    const algorithms = config.get('JWT_ALGORITHM') || 'HS256';
    const secretOrKey =
      algorithms === 'HS256'
        ? config.get('JWT_SECRET')
        : readFileSync(config.get('JWT_KEY_FOLDER') + config.get('JWT_SECRET'));

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
      algorithms,
    });
  }

  async validate(args: any) {
    return args;
  }
}
