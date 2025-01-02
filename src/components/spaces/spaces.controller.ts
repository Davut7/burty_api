import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { SpacesType } from 'src/helpers/types/spaces.type';
import { CurrentUser } from '../../common/decorators/currentUser.decorator';
import { UserTokenDto } from '../token/dto/token.dto';
import { GetNearbySpacesOperation } from './decorators/getNearbySpacesOperation.decorator';
import { GetOneSpaceOperation } from './decorators/getOneSpaceOperation.decorator';
import { GetPopularSpacesOperation } from './decorators/getPopularSpacesOperation.decorator';
import { GetSpacesByFilterOperation } from './decorators/getSpacesByFilterOperation.decorator';
import { GetNearbySpacesQuery } from './query/getNearbySpaces.query';
import { GetOneSpaceQuery } from './query/getOneSpace.query';
import { GetSpacesByFilterQuery } from './query/getSpacesByFilter.query';
import { SpacesService } from './spaces.service';

@ApiTags('spaces')
@ApiBearerAuth()
@USER()
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @GetNearbySpacesOperation()
  @Get('nearby')
  @HttpCode(HttpStatus.OK)
  async getNearbySpaces(
    @Query() query: GetNearbySpacesQuery,
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<SpacesType[]> {
    return this.spacesService.getNearbySpaces(query, currentUser.id);
  }

  @GetPopularSpacesOperation()
  @Get('popular')
  @HttpCode(HttpStatus.OK)
  async getPopularSpaces(
    @Query() query: GetNearbySpacesQuery,
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<SpacesType[]> {
    return this.spacesService.getPopularSpaces(query, currentUser.id);
  }

  @GetSpacesByFilterOperation()
  @Get('filter')
  @HttpCode(HttpStatus.OK)
  async getSpacesByFilter(
    @Query() query: GetSpacesByFilterQuery,
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<SpacesType[]> {
    return this.spacesService.getSpacesByFilter(query, currentUser.id);
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
