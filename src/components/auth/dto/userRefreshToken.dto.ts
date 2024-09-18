import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class UserRefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
