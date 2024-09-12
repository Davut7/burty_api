import { SetMetadata } from '@nestjs/common';

export const IS_RESET_TOKEN = 'IS_RESET_TOKEN';

export const RESET_TOKEN = () => SetMetadata(IS_RESET_TOKEN, true);
