import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserAuth } from '../interface';

export const CurrentUser = createParamDecorator<IUserAuth>(
  (data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp().getRequest();
    return ctx.user;
  },
);
