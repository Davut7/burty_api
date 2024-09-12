import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SuccessResponse {
  @Expose()
  @ApiProperty({
    description: 'Response message indicating the result of the operation',
    example: 'Operation successful.',
    required: true,
  })
  message!: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Access token provided upon successful authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  accessToken?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Refresh token provided for obtaining a new access token',
    example: 'd1d2d3d4d5d6d7d8d9d0...',
    required: false,
  })
  refreshToken?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Reset token for reset password',
    example: 'd1d2d3d4d5d6d7d8d9d0...',
    required: false,
  })
  resetToken?: string;
}
