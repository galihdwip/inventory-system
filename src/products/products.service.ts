import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductDto, CreateVariantDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) { }

  async create(tenantId: number, createProductDto: CreateProductDto): Promise<Product> {
    if (createProductDto.variants && createProductDto.variants.length > 0) {
      for (const vDto of createProductDto.variants) {
        const existing = await this.variantRepository.findOne({ where: { sku: vDto.sku } });
        if (existing) {
          throw new ConflictException(`SKU ${vDto.sku} is already in use`);
        }
      }
    }

    const product = this.productRepository.create({
      tenantId,
      name: createProductDto.name,
      description: createProductDto.description,
    });

    const savedProduct = await this.productRepository.save(product);

    if (createProductDto.variants && createProductDto.variants.length > 0) {
      const variants = createProductDto.variants.map((vDto) =>
        this.variantRepository.create({
          ...vDto,
          productId: savedProduct.id,
        }),
      );
      savedProduct.variants = await this.variantRepository.save(variants);
    }

    return savedProduct;
  }

  async findAll(tenantId: number, filters: Record<string, string>): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.tenantId = :tenantId', { tenantId });

    const reservedKeys = ['tenantId'];
    for (const [key, value] of Object.entries(filters)) {
      if (!reservedKeys.includes(key) && value) {
        query.andWhere(`variants.attributes ->> :key_${key} = :val_${key}`, {
          [`key_${key}`]: key,
          [`val_${key}`]: value,
        });
      }
    }

    return await query.getMany();
  }

  async findOne(tenantId: number, id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, tenantId },
      relations: { variants: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async addVariant(tenantId: number, productId: number, createVariantDto: CreateVariantDto): Promise<ProductVariant> {
    await this.findOne(tenantId, productId);

    const existing = await this.variantRepository.findOne({ where: { sku: createVariantDto.sku } });
    if (existing) {
      throw new ConflictException(`SKU ${createVariantDto.sku} is already in use`);
    }

    const variant = this.variantRepository.create({
      ...createVariantDto,
      productId,
    });

    return await this.variantRepository.save(variant);
  }

  // async getVariant(id: number, tenantId: number): Promise<ProductVariant> {
  //   const productVariant = await this.findVariant(id, tenantId);

  //   return productVariant;
  // }

  async findVariant(tenantId: number, id: number): Promise<ProductVariant> {

    const productVariant = await this.variantRepository.findOne({
      where: { id: id },
      relations: { product: true },
    });

    console.log('productVariant', productVariant)
    if (!productVariant) {
      throw new NotFoundException(`Product Variant with ID ${id} not found`);
    }

    if (productVariant.product.tenantId !== tenantId) {
      throw new NotFoundException(`Product Variant with ID ${productVariant.id} not found under this tenant`);
    }

    return productVariant;
  }
}
