import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/helpers/dto/page.dto';

export enum BookingTimeEnum {
  WEEK = 7,
  MONTH = 30,
  THREEMONTHS = 90,
}

export class GetBookingsQuery extends PickType(PageOptionsDto, [
  'take',
  'page',
]) {
  @IsOptional()
  @IsEnum(BookingTimeEnum)
  @ApiProperty({ description: 'Filter by time' })
  time: BookingTimeEnum;
}
