import { $Enums, Media } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class MediaType implements Media {
  @ApiProperty({
    description: 'Unique identifier of the media file',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the file stored in the system',
    example: 'file123.jpg',
  })
  fileName: string;

  @ApiProperty({
    description: 'Path where the file is stored',
    example: '/uploads/images/file123.jpg',
  })
  filePath: string;

  @ApiProperty({
    description: 'Type of the media file',
    enum: $Enums.MediaType,
    example: $Enums.MediaType.IMAGE,
  })
  mediaType: $Enums.MediaType;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/jpeg',
  })
  mimeType: string;

  @Exclude()
  createdAt: Date;

  @ApiProperty({
    description: 'Original name of the uploaded file',
    example: 'picture.jpg',
  })
  originalName: string;

  @ApiProperty({
    description: 'Size of the file in bytes',
    example: '2048',
  })
  size: string;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  userId: string;

  @Exclude()
  spaceId: string;

  @Exclude()
  qrCodeId: string;
}
