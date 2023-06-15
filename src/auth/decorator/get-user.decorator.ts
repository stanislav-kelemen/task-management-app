import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (prop: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return prop ? request.user[prop] : request.user;
  },
);
