import { PickType } from '@nestjs/swagger';
import { SuccessResponse } from './successResponse.type';

export class SuccessMessageType extends PickType(SuccessResponse, [
  'message',
] as const) {}
