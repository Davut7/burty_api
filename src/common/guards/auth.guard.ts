import { TokenService } from '../../components/token/token.service';
import { RedisService } from '../../libs/redis/redis.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/isPublic.decorator';
import { UserRole } from '@prisma/client';
import { IS_RESET_TOKEN } from '../decorators/isResetToken.decorator';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { IS_MENTOR_KEY } from '../decorators/isMentor.decorator';
import { IS_USER_KEY } from '../decorators/isUser.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private tokenService: TokenService,
    private redisService: RedisService,
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isUser = this.reflector.getAllAndOverride(IS_USER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isMentor = this.reflector.getAllAndOverride(IS_MENTOR_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isResetToken = this.reflector.getAllAndOverride(IS_RESET_TOKEN, [
      context.getHandler(),
      context.getClass(),
    ]);

    try {
      if (isPublic) {
        return true
      };
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        this.logger.error('User unauthorized');
        throw new UnauthorizedException('User unauthorized');
      }

      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        this.logger.error('User unauthorized');
        throw new UnauthorizedException('User unauthorized');
      }

      if (isUser) {
        const userToken = this.tokenService.validateAccessToken(token);
        if (!userToken.isVerified) {
          this.logger.error('Please verify your account');
          throw new ForbiddenException('Please verify your account');
        }
        const tokenInBlackList = await this.redisService.getRedisToken(token);
        if (tokenInBlackList) {
          this.logger.error('Token is invalid');
          throw new UnauthorizedException('Token is invalid');
        }
        if (userToken.role !== UserRole.USER) {
          const message = `You do not have the necessary permissions to access this resource`;
          this.logger.error(message);
          throw new ForbiddenException(message);
        }
        req.currentUser = userToken;
        return true;
      }

      if (isMentor) {
        const userToken = this.tokenService.validateAccessToken(token);
        if (!userToken.isVerified) {
          this.logger.error('Please verify your account');
          throw new ForbiddenException('Please verify your account');
        }
        const tokenInBlackList = await this.redisService.getRedisToken(token);
        if (tokenInBlackList) {
          this.logger.error('Token is invalid');
          throw new UnauthorizedException('Token is invalid');
        }
        if (userToken.role !== UserRole.MENTOR) {
          const message = `You do not have the necessary permissions to access this resource`;
          this.logger.error(message);
          throw new ForbiddenException(message);
        }
        req.currentUser = userToken;
        return true;
      }
      if (isResetToken) {
        const userToken = await this.tokenService.validateResetToken(token);
        if (!userToken) {
          this.logger.error('Invalid token');
          throw new UnauthorizedException('Invalid token');
        }
        req.currentUser = userToken;
        return true;
      }
      const userToken = this.tokenService.validateAccessToken(token);
      if (!userToken.isVerified) {
        this.logger.error('Please verify your account');
        throw new ForbiddenException('Please verify your account');
      }
      const tokenInBlackList = await this.redisService.getRedisToken(token);
      if (tokenInBlackList) {
        this.logger.error('Token is invalid');
        throw new UnauthorizedException('Token is invalid');
      }
      req.currentUser = userToken;
      return true;
    } catch (e) {
      this.logger.error('User unauthorized');
      throw new UnauthorizedException('User unauthorized');
    }
  }
}
