import { PickType } from '@nestjs/swagger';
import { BookingType } from '../types/booking.type';
import { $Enums } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { IsValidStartDate } from 'src/common/decorators/isValidDate.decorator';
import { IsValidVisitTime } from 'src/common/decorators/isValidVisitTime.decorator';

export class BookingDto extends PickType(BookingType, [
  'passType',
  'startDate',
  'visitTime',
]) {
  @IsNotEmpty()
  @IsEnum($Enums.PassType)
  passType: $Enums.PassType;

  @IsNotEmpty()
  @IsValidStartDate()
  startDate: Date;

  @IsNotEmpty()
  @IsValidVisitTime()
  visitTime: string;
}
