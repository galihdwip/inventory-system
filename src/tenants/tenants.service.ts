import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
  ) {}

  async create(name: string, domain: string): Promise<Tenant> {
    const existing = await this.tenantsRepository.findOne({ where: { domain } });
    if (existing) {
      throw new ConflictException(`Tenant with domain ${domain} already exists`);
    }
    const tenant = this.tenantsRepository.create({ name, domain });
    return await this.tenantsRepository.save(tenant);
  }

  async findAll(): Promise<Tenant[]> {
    return await this.tenantsRepository.find();
  }

  async findOne(id: number): Promise<Tenant> {
    const tenant = await this.tenantsRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async update(id: number, name?: string, domain?: string): Promise<Tenant> {
    const tenant = await this.findOne(id);
    
    if (domain && domain !== tenant.domain) {
      const existing = await this.tenantsRepository.findOne({ where: { domain } });
      if (existing) {
        throw new ConflictException(`Tenant with domain ${domain} already exists`);
      }
      tenant.domain = domain;
    }

    if (name !== undefined) {
      tenant.name = name;
    }

    return await this.tenantsRepository.save(tenant);
  }
}

