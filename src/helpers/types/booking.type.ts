import { $Enums, Bookings } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class BookingType implements Bookings {
  @ApiProperty({
    description: 'Unique identifier for the booking',
    example: 'e3dcbf5a-cf5d-49b8-bfda-c27945897b78',
  })
  id: string;

  @ApiProperty({
    description: 'Type of pass associated with the booking',
    enum: $Enums.PassType,
    example: $Enums.PassType.single,
  })
  passType: $Enums.PassType;

  @ApiProperty({
    description: 'The number of players associated with the booking',
    example: 4,
  })
  playersCount: number;

  @ApiProperty({
    description: 'The price of the booking',
    example: 150.0,
  })
  price: number;

  @ApiProperty({
    description: 'The ID of the space where the booking is made',
    example: 'abcd1234-space-id',
  })
  spaceId: string;

  @ApiProperty({
    description: 'Indicates whether the booking is archived',
    example: false,
  })
  isArchived: boolean;

  @ApiProperty({
    description: 'The start date of the booking',
    example: '2024-09-21T15:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'The status of the booking',
    enum: $Enums.BookingStatus,
    example: $Enums.BookingStatus.pending,
  })
  status: $Enums.BookingStatus;

  @ApiProperty({
    description: 'The ID of the user who made the booking',
    example: 'user-1234',
  })
  userId: string;

  @ApiProperty({
    description: 'The date and time when the booking was created',
    example: '2024-09-20T14:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The start time of the visit for the booking',
    example: '15:30',
  })
  startTime: string;

  @ApiProperty({
    description: 'The end time of the visit for the booking',
    example: '15:30',
  })
  endTime;
}
