import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getMySQLConnString } from 'src/main';

let prismaClient: PrismaClient = null;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  async connectToDB() {
    const dbURL = await getMySQLConnString();
    if (prismaClient) {
      await prismaClient.$disconnect();
    }
    prismaClient = null;
    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: dbURL,
        },
      },
    });
    try {
      await prismaClient.$connect();
    } catch (error) {
      console.log(error);
    }
  }
  async onModuleInit() {
    this.connectToDB();
  }

  getPrismaClient() {
    return prismaClient;
  }

  onModuleDestroy() {
    prismaClient?.$disconnect();
  }
}
