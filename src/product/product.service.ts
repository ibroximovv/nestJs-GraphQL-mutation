import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService){}
  async create(createProductInput: CreateProductInput) {
    try {
      const findOne = await this.prisma.category.findFirst({ where: { id: createProductInput.categoryId }})
      if (!findOne) throw new BadRequestException('Category not found')
      return await this.prisma.product.create({ data: createProductInput });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findAll(categoryId?: number, search?: string, findColor?: string, priceFrom?: number, priceTo?: number, page: number = 1, limit: number = 10) {
    try {
      return await this.prisma.product.findMany({
        where: {
          AND: [
            search ? {
              name: {
                contains: search,
                mode: 'insensitive'
              }
            }: {},
            categoryId !== undefined ? {
              categoryId
            }: {},
            findColor !== undefined ? {
              color: findColor
            }: {},
            priceFrom !== undefined ? {
              price: {
                gte: priceFrom
              }
            }: {},
            priceTo !== undefined ? {
              price: {
                lte: priceTo,
              },
            }: {},
          ]
        },
        skip: ( page - 1 ) * limit,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: number) {
    try {
      const findOne = await this.prisma.product.findFirst({ where: { id }, 
        include: {
          category: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      })
      if (!findOne) throw new BadRequestException('Product not found')
      return findOne;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async update(id: number, updateProductInput: UpdateProductInput) {
    try {
      const findOne = await this.prisma.product.findFirst({ where: { id }})
      if (!findOne) throw new BadRequestException('Product not found')
      return await this.prisma.product.update({ where: { id }, data: updateProductInput });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async remove(id: number) {
    try {
      const findOne = await this.prisma.product.findFirst({ where: { id }})
      if (!findOne) throw new BadRequestException('Product not found')
      return await this.prisma.product.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
