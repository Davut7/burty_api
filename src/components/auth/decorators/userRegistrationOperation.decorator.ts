import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UserRegistrationDto } from '../dto/userRegistration.dto';
import { UserRegistrationResponse } from '../responses/userRegistration.response';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

export function UserRegistrationOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiBody({ type: UserRegistrationDto }),
    ApiCreatedResponse({
      description: 'User registration successful.',
      type: UserRegistrationResponse,
    }),
    ApiConflictResponse({
      description: 'User with email already exists!',
    }),
    UseInterceptors(new TransformDataInterceptor(UserRegistrationResponse)),
    UseGuards(ThrottlerGuard),
    PUBLIC(),
  );
}
