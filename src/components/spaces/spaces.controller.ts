import {
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { GetNearbySpacesQuery } from './query/getNearbySpaces.query';
import { GetSpacesByFilterQuery } from './query/getSpacesByFilter.query';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetNearbySpacesOperation } from './decorators/getNearbySpacesOperation.decorator';
import { GetPopularSpacesOperation } from './decorators/getPopularSpacesOperation.decorator';
import { GetSpacesByFilterOperation } from './decorators/getSpacesByFilterOperation.decorator';
import { GetOneSpaceOperation } from './decorators/getOneSpaceOperation.decorator';

@ApiTags('spaces')
@ApiBearerAuth()
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @GetNearbySpacesOperation()
  @Get('nearby')
  @HttpCode(HttpStatus.OK)
  async getNearbySpaces(@Query() query: GetNearbySpacesQuery) {
    return this.spacesService.getNearbySpaces(query);
  }

  @GetPopularSpacesOperation()
  @Get('popular')
  @HttpCode(HttpStatus.OK)
  async getPopularSpaces(@Query() query: GetNearbySpacesQuery) {
    return this.spacesService.getPopularSpaces(query);
  }

  @GetSpacesByFilterOperation()
  @Get('filter')
  @HttpCode(HttpStatus.OK)
  async getSpacesByFilter(@Query() query: GetSpacesByFilterQuery) {
    return this.spacesService.getSpacesByFilter(query);
  }

  @GetOneSpaceOperation()
  @Get(':categoryId')
  @HttpCode(HttpStatus.OK)
  async getOneSpace(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return this.spacesService.getOneSpace(categoryId);
  }
}
