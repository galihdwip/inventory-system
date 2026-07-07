import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TenantsResolver } from './tenants.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantsService, TenantsResolver],
  controllers: [TenantsController],
  exports: [TenantsService],
})
export class TenantsModule {}

