import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  // Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiTags } from '@nestjs/swagger';
import { jwtDecode } from 'jwt-decode';
import { UserService } from 'src/user/user.service';

@Controller('todo/:uid')
@ApiTags('Todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly userService: UserService,
  ) {}

  async getUserIdFromAuthToken(authToken, uid) {
    const decoded = jwtDecode(authToken);
    const userEmail = (decoded as any).email;
    if (userEmail) {
      const res = await this.userService.user({ email: userEmail });
      console.log(res);
      if (uid != res.id) {
        throw new UnauthorizedException();
      }
    }
  }

  @Post()
  create(@Param('uid') uid: string, @Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create({
      ...createTodoDto,
      startDate: new Date(createTodoDto.startDate).toISOString(),
      endDate: new Date(createTodoDto.endDate).toISOString(),
      userId: +uid,
    });
  }

  @Get()
  async findAll(
    @Param('uid') uid: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('category') category: string,
    @Query('status') status: string,
    // @Headers() headers,
  ) {
    // await this.getUserIdFromAuthToken(headers['auth-token'], uid);
    console.log(category, status);
    return this.todoService.todos({
      where: { userId: +uid, category, status },
      skip: skip ? +skip : 0,
      take: take ? +take : 50,
    });
  }

  @Get(':id')
  findOne(@Param('uid') uid: string, @Param('id') id: string) {
    return this.todoService.todo({ id: +id, userId: +uid });
  }

  @Patch(':id')
  update(
    @Param('uid') uid: string,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.updateTodo({
      where: { id: +id, userId: +uid },
      data: updateTodoDto,
    });
  }

  @Delete(':id')
  remove(@Param('uid') uid: string, @Param('id') id: string) {
    return this.todoService.deleteTodo({ id: +id, userId: +uid });
  }
}
