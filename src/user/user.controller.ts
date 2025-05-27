import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.userService.users({});
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.user({ id: +id });
  // }

  @Get(':email')
  findOneUsingEmail(@Param('email') email: string) {
    return this.userService.user({ email: email });
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.updateUser({
  //     where: { id: +id },
  //     data: updateUserDto,
  //   });
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.deleteUser({ id: +id });
  // }
}
