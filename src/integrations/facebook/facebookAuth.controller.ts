import { Controller, Get, Query, Res, UseInterceptors } from '@nestjs/common';
import { FacebookAuthService } from './facebookAuth.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { FastifyReply } from 'fastify';
import { FacebookLoginResponse } from './response/facebookLogin.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

@ApiTags('facebook-auth')
@Controller('facebook/auth')
export class FacebookAuthController {
  constructor(private readonly facebookAuthService: FacebookAuthService) {}

  @Get('')
  @PUBLIC()
  @ApiOperation({ summary: 'Redirect to FaceBook Auth URL' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to the FaceBook authentication URL.',
  })
  async faceBookAuth(@Res() res: FastifyReply<any>) {
    const url = this.facebookAuthService.getAuthUrl();
    res.redirect(302, url);
  }

  @Get('callback')
  @ApiOperation({ summary: 'FaceBook Auth Callback' })
  @ApiQuery({
    name: 'code',
    required: true,
    type: String,
    description: 'Authorization code from FaceBook',
  })
  @ApiResponse({
    status: 200,
    type: FacebookLoginResponse,
  })
  @UseInterceptors(new TransformDataInterceptor(FacebookLoginResponse))
  @PUBLIC()
  async faceBookAuthRedirect(@Query('code') code: string) {
    const user = await this.facebookAuthService.facebookLogin(code);
    return user;
  }
}
