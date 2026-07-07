import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentTenantId = createParamDecorator(
  (data: unknown, context: ExecutionContext): number => {
    if (context.getType<string>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context).getContext();
      return gqlCtx.req.tenantId;
    }
    const request = context.switchToHttp().getRequest();
    return request.tenantId;
  },
);
