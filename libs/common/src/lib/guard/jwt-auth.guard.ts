import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, ROLES_KEY } from '../decorator';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '../enum';
import { IUserAuth } from '../interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  override async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user as IUserAuth;

    /**
     * Using if protect your route by user role (RBAC)
     * */
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles) {
      return requiredRoles.some((role) => user?.role === role);
    }

    return !!user;
  }

  override handleRequest<IUserAuth>(
    err: any,
    user: IUserAuth,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): IUserAuth {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
