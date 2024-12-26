import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { IsValidStartDate } from 'src/common/decorators/isValidDate.decorator';
import { IsValidVisitTime } from 'src/common/decorators/isValidVisitTime.decorator';

export class BookingDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  playersCount: number;

  @IsNotEmpty()
  @IsValidStartDate()
  startDate: string;

  @IsNotEmpty()
  @IsValidVisitTime()
  visitTime: string;
}
