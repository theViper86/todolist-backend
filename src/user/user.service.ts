import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(userCreateInput: Prisma.UserCreateInput) {
    try {
      return await this.prisma
        .getPrismaClient()
        .user.create({ data: userCreateInput });
    } catch (error) {
      if (typeof error.message === 'string') {
        if (error.code === 'P2002') {
          throw new BadRequestException(error.message);
        }
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.getPrismaClient().user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.getPrismaClient().user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    try {
      return await this.prisma.getPrismaClient().user.update({
        data,
        where,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    try {
      return await this.prisma.getPrismaClient().user.delete({
        where,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
