import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    let request;
    if (context.getType<string>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      request = gqlContext.req;
    } else {
      request = context.switchToHttp().getRequest();
    }

    const tenantIdHeader = request.headers['x-tenant-id'];

    if (!tenantIdHeader) {
      throw new BadRequestException('x-tenant-id header is missing');
    }

    const tenantId = parseInt(tenantIdHeader, 10);
    if (isNaN(tenantId)) {
      throw new BadRequestException('Invalid x-tenant-id header');
    }

    request.tenantId = tenantId;
    return true;
  }
}

