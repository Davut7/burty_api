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
import { SpacesType } from 'src/helpers/types/spaces.type';
import { GetOneSpaceQuery } from './query/getOneSpace.query';

@ApiTags('spaces')
@ApiBearerAuth()
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @GetNearbySpacesOperation()
  @Get('nearby')
  @HttpCode(HttpStatus.OK)
  async getNearbySpaces(
    @Query() query: GetNearbySpacesQuery,
  ): Promise<SpacesType[]> {
    return this.spacesService.getNearbySpaces(query);
  }

  @GetPopularSpacesOperation()
  @Get('popular')
  @HttpCode(HttpStatus.OK)
  async getPopularSpaces(
    @Query() query: GetNearbySpacesQuery,
  ): Promise<SpacesType[]> {
    return this.spacesService.getPopularSpaces(query);
  }

  @GetSpacesByFilterOperation()
  @Get('filter')
  @HttpCode(HttpStatus.OK)
  async getSpacesByFilter(
    @Query() query: GetSpacesByFilterQuery,
  ): Promise<SpacesType[]> {
    return this.spacesService.getSpacesByFilter(query);
  }

  @GetOneSpaceOperation()
  @Get(':spaceId')
  @HttpCode(HttpStatus.OK)
  async getOneSpace(
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Query() query: GetOneSpaceQuery,
  ): Promise<SpacesType> {
    return this.spacesService.getOneSpace(spaceId, query);
  }
}