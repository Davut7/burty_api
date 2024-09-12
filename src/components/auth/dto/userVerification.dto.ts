import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserVerificationDto {
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @ApiProperty({ description: 'Verification code for verify account!' })
  verificationCode: string;
}
