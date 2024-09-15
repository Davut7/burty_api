import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UserLoginResponse } from '../responses/userLogin.response';
import { UserLoginDto } from '../dto/userLogin.dto';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

export function UserLoginOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'User login' }),
    ApiBody({ type: UserLoginDto }),
    ApiResponse({
      status: 200,
      description: 'User login successful!',
      type: UserLoginResponse,
    }),
    ApiBadRequestResponse({ description: 'User not verified.' }),
    ApiBadRequestResponse({ description: 'Invalid password!' }),
    ApiNotFoundResponse({ description: 'User with email not found!' }),
    UseGuards(ThrottlerGuard),
    PUBLIC(),
    UseInterceptors(
      SetCookieInterceptor,
      new TransformDataInterceptor(UserLoginResponse),
    ),
  );
}
