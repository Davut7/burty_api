import { PickType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/helpers/dto/page.dto';

export class GetCategoriesQuery extends PickType(PageOptionsDto, [
  'page',
  'take',
] as const) {}
