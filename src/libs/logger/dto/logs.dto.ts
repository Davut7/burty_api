import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../helpers/dto/page.dto';

export class LogsModel {
    id?: number;
    host?: string;
    url?: string;
    statusCode?: number;
    method?: string;
    user?: string;
    context?: string;
    message?: string;
    level?: string;
    time?: string;
    createdAt?: Date;
}

export class CreateLogDto extends PartialType(LogsModel) {}

export enum LogMethodEnum {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    PUT = 'PUT',
}

export enum LogLevelEnum {
    LOG = 'log',
    WARN = 'warn',
    ERROR = 'error',
    VERBOSE = 'verbose',
    DEBUG = 'debug',
}

export enum LogsSortEnum {
    createdAt_ASC = 'createdAt_ASC',
    createdAt_DESC = 'createdAt_DESC',
    id_ASC = 'id_ASC',
    id_DESC = 'id_DESC',
}

export class FindLogsFilter extends PickType(PageOptionsDto, [
    'page',
    'take',
    'order',
]) {
    @ApiProperty({
        title: 'Filter by HTTP methods',
        description: 'Filtering logs by methods, [POST, GET, PUT, DELETE]',
        type: LogMethodEnum,
        nullable: true,
        example: 'POST',
        enum: LogMethodEnum,
        enumName: 'HTTP methods',
        required: false,
    })
    @IsOptional()
    method?: LogMethodEnum;

    @ApiProperty({
        title: 'Filter by Log levels',
        description:
            'Filtering by logs levels, [log, error, verbose, debug, warn]',
        type: LogLevelEnum,
        nullable: true,
        example: 'log',
        enum: LogLevelEnum,
        enumName: 'Log levels',
        required: false,
    })
    @IsOptional()
    @IsEnum(LogLevelEnum)
    level?: LogLevelEnum;

    // @IsOptional()
    // @IsNumber()
    // status: LogStatusEnum;

    @ApiProperty({
        title: 'Sort logs',
        description: 'Sort by logs levels [createdAt, id]',
        type: LogsSortEnum,
        nullable: true,
        example: 'id',
        enum: LogsSortEnum,
        enumName: 'Log sort',
        required: false,
    })
    @IsOptional()
    @IsEnum(LogsSortEnum)
    orderBy?: LogsSortEnum;
}
