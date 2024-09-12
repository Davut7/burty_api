import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteProfilePictureOperation() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Profile picture deleted successfully',
      type: SuccessMessageType,
    }),
    ApiBearerAuth(),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiOperation({ summary: 'Delete profile picture' }),
  );
}
