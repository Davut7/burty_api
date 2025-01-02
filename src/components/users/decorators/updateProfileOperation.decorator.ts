import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UpdateUserProfile } from '../response/updateUserProfile.response';

export function UpdateProfileOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Profile update operation!' }),
    ApiOkResponse({ type: UpdateUserProfile }),
    ApiNotFoundResponse({ description: 'User not found!' }),
    UseInterceptors(new TransformDataInterceptor(UpdateUserProfile)),
  );
}
