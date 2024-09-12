import { SetMetadata } from '@nestjs/common';

export const IS_USER_KEY = 'IS_USER_KEY';

export const USER = () => SetMetadata(IS_USER_KEY, true);
