import { SetMetadata } from '@nestjs/common';

export const IS_MENTOR_KEY = 'IS_MENTOR_KEY';

export const MENTOR = () => SetMetadata(IS_MENTOR_KEY, true);
