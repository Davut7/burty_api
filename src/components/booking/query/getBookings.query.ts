import { PickType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/helpers/dto/page.dto';

export class GetBookingsQuery extends PickType(PageOptionsDto, [
  'take',
  'page',
]) {
  time: BookingTimeEnum;
}

export enum BookingTimeEnum {
  WEEK = 7,
  MONTH = 30,
  THREEMONTHS = 90,
}
