import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { recursivelyStripNullValues } from '../../helpers/providers/recursivelyStripeNullValues';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (data && typeof data === 'object') {
          return recursivelyStripNullValues(data);
        }
        return data;
      }),
    );
  }
}
