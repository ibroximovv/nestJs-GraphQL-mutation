import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService){}
  async create(createCategoryInput: CreateCategoryInput) {
    try {
      return await this.prisma.category.create({ data: createCategoryInput })
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(search?: string, page: number = 1, limit: number = 10) {
    try {
      return await this.prisma.category.findMany({
        where: {
          AND: [
            search ? {
              name: {
                contains: search,
                mode: 'insensitive'
              }
            }: {},
          ]
        },
        skip: ( page - 1 ) * limit,
        take: limit
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: number) {
    try {
      const findOne = await this.prisma.category.findFirst({ where: { id }})
      if (!findOne) throw new BadRequestException('Category not found')
      return findOne;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: number, updateCategoryInput: UpdateCategoryInput) {
    try {
      const findOne = await this.prisma.category.findFirst({ where: { id }})
      if (!findOne) throw new BadRequestException('Category not found')
      return await this.prisma.category.update({ where: { id }, data: updateCategoryInput });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: number) {
    try {
      const findOne = await this.prisma.category.findFirst({ where: { id }})
      if (!findOne) throw new BadRequestException('Category not found')
      return await this.prisma.category.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
