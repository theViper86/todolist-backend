import { CreateTodoDto } from './dto/create-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto & { userId: number }) {
    try {
      return await this.prisma
        .getPrismaClient()
        .todo.create({ data: createTodoDto });
    } catch (error) {
      if (typeof error.message === 'string') {
        if (error.code === 'P2002') {
          throw new BadRequestException(error.message);
        }
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async todos(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TodoWhereUniqueInput;
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.TodoOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.getPrismaClient().todo.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async todo(todoWhereUniqueInput: Prisma.TodoWhereUniqueInput) {
    return this.prisma.getPrismaClient().todo.findUnique({
      where: todoWhereUniqueInput,
    });
  }

  async updateTodo(params: {
    where: Prisma.TodoWhereUniqueInput;
    data: Prisma.TodoUpdateInput;
  }) {
    const { where, data } = params;
    try {
      return await this.prisma.getPrismaClient().todo.update({
        data,
        where,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteTodo(where: Prisma.TodoWhereUniqueInput) {
    try {
      return await this.prisma.getPrismaClient().todo.delete({
        where,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
