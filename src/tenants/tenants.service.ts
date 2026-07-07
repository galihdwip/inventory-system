import { Injectable, ConflictException } from '@nestjs/common';
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

  async findOne(id: number): Promise<Tenant | null> {
    return await this.tenantsRepository.findOne({ where: { id } });
  }
}
