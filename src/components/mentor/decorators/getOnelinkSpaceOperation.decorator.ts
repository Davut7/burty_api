import { HttpCode, HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { LinkedSpacesType } from 'src/helpers/types/linkedSpaces.type';

export function GetOneLinkedSpaceOperation() {
  return applyDecorators(
    ApiOkResponse({ type: LinkedSpacesType }),
    ApiNotFoundResponse({ description: 'Linked space not found!' }),
    HttpCode(HttpStatus.OK),
  );
}
