import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateSignatureService } from '../util';

@Injectable()
export class InternalApiGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const serviceId = request.header('X-Service-Id');

    const timestamp = request.header('X-Timestamp');

    const signature = request.header('X-Signature');

    if (!serviceId || !timestamp || !signature) {
      throw new UnauthorizedException();
    }

    const now = Date.now();

    if (Math.abs(now - Number(timestamp)) > 5 * 60 * 1000) {
      throw new UnauthorizedException('Timestamp expired');
    }

    const secret = this.getSecret(serviceId);

    const expected = generateSignatureService(
      request.method,
      request.route.path,
      timestamp,
      request.body,
      secret,
    );

    console.log({
      serviceId,
      signature,
      timestamp,
      expected,
    });

    if (expected !== signature) {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }

  private getSecret(serviceId: string): string {
    const secrets: Record<string, string> = {
      'order-service': this.config.getOrThrow('ORDER_SERVICE_SECRET'),
    };

    if (!secrets[serviceId]) {
      throw new UnauthorizedException();
    }

    return secrets[serviceId];
  }
}
