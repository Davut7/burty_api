import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddParticipiantsToBookingDto {
  @ApiProperty({ description: 'Player email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
