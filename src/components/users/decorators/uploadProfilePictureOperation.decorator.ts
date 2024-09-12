import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { diskStorage, FileFastifyInterceptor } from 'fastify-file-interceptor';
import { imageFilter } from 'src/common/filters/imageFilter';
import { FileDto } from 'src/helpers/dto/file.dto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function UploadProfilePictureOperation() {
  return applyDecorators(
    UseInterceptors(
      FileFastifyInterceptor('file', {
        storage: diskStorage({
          destination: './temp',
          filename: (req, file, cb) => {
            const fileExtension = file.mimetype.split('/')[1];
            const uniqueFileName = `${randomUUID()}.${fileExtension}`;
            cb(null, uniqueFileName);
          },
        }),
        limits: { fileSize: 1024 * 1024 * 1500 },
        fileFilter: imageFilter,
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: FileDto }),
    ApiBearerAuth(),
    ApiCreatedResponse({
      description: 'Profile picture uploaded successfully',
      type: SuccessMessageType,
    }),
    ApiOperation({ summary: 'Upload profile picture' }),
    ApiNotFoundResponse({ description: 'User not found!' }),
  );
}
