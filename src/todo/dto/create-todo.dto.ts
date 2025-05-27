import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: any;

  @ApiProperty()
  @IsNotEmpty()
  endDate: any;

  @ApiProperty()
  @IsNotEmpty()
  status: string;
}
