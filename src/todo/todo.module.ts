import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, UserService],
})
export class TodoModule {}
