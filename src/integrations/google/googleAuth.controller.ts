import {
  Controller,
  Get,
  Query,
  Redirect,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GoogleAuthService } from './googleAuth.service';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { GoogleLoginResponse } from './response/googleLogin.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

@ApiTags('google-auth')
@Controller('google/auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @PUBLIC()
  @Get()
  @Redirect()
  @ApiOperation({ summary: 'Get Google Auth URL' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to the Google authentication URL.',
  })
  async googleAuth() {
    const url = this.googleAuthService.getAuthUrl();
    return { url };
  }

  @Get('callback')
  @ApiOperation({ summary: 'Google Auth Callback' })
  @ApiQuery({
    name: 'code',
    required: true,
    type: String,
    description: 'Authorization code from Google',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the tokens received from Google.',
    type: GoogleLoginResponse,
  })
  @UseInterceptors(new TransformDataInterceptor(GoogleLoginResponse))
  @PUBLIC()
  async googleAuthRedirect(@Query('code') code: string) {
    const user = await this.googleAuthService.googleLogin(code);
    return user;
  }
}
