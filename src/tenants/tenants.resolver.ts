import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TenantsService } from './tenants.service';
import { Tenant } from './entities/tenant.entity';

@Resolver(() => Tenant)
export class TenantsResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Query(() => [Tenant], { name: 'tenants' })
  async getTenants(): Promise<Tenant[]> {
    return this.tenantsService.findAll();
  }

  @Mutation(() => Tenant)
  async createTenant(
    @Args('name') name: string,
    @Args('domain') domain: string,
  ): Promise<Tenant> {
    return this.tenantsService.create(name, domain);
  }
}
