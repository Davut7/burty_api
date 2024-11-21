import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class HealthCheckAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers['authorization'];

    if (
      authToken === `Bearer ${this.configService.get('HEALTH_CHECK_TOKEN')}`
    ) {
      return true;
    } else {
      throw new UnauthorizedException('Request sender unauthorized!');
    }
  }
}
