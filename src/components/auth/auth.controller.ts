import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { RedisService } from 'src/libs/redis/redis.service';
import { UserTokenDto } from '../token/dto/token.dto';
import { AuthService } from './auth.service';
import { ForgotPasswordOperation } from './decorators/forgotPasswordOperation.decorator';
import { ResendVerificationCodeOperation } from './decorators/resendVerificationCodeOperation.decorator';
import { ResetPasswordOperation } from './decorators/resetPasswordOperation.decorator';
import { UserLoginOperation } from './decorators/userLoginOperation.decorator';
import { UserLogoutOperation } from './decorators/userLogout.decorator';
import { UserRefreshOperation } from './decorators/userRefreshOperation.decorator';
import { UserRegistrationOperation } from './decorators/userRegistrationOperation.decorator';
import { UserVerificationOperation } from './decorators/userVerificationOperation.decorator';
import { ValidateResetPassword } from './decorators/validateResetPasswordOperation.decorator';
import { VerifyForgotPasswordOperation } from './decorators/verifyForgotPasswordOperation.decorator';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UserForgotPasswordDto } from './dto/userForgotPassword.dto';
import { UserLoginDto } from './dto/userLogin.dto';
import { UserRefreshTokenDto } from './dto/userRefreshToken.dto';
import { UserRegistrationDto } from './dto/userRegistration.dto';
import { UserVerificationDto } from './dto/userVerification.dto';
import { UserForgotPasswordResponse } from './responses/userForgotPassword.response';
import { UserForgotPasswordVerificationResponse } from './responses/userForgotPasswordVerification.response';
import { UserLoginResponse } from './responses/userLogin.response';
import { UserRefreshResponse } from './responses/userRefresh.response';
import { UserRegistrationResponse } from './responses/userRegistration.response';
import { UserResendVerificationCodeResponse } from './responses/userResendVerificationCode.response';
import { UserVerifyResponse } from './responses/userVerify.response';
import { ValidateResetPasswordResponse } from './responses/validateResetPasswordLink.response';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private redisService: RedisService,
  ) {}

  @UserRegistrationOperation()
  @Post('registration')
  async userRegistration(
    @Body() dto: UserRegistrationDto,
  ): Promise<UserRegistrationResponse> {
    return await this.authService.userRegistration(dto);
  }

  @UserVerificationOperation()
  @Patch(':userId/verify')
  async userVerification(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UserVerificationDto,
  ): Promise<UserVerifyResponse> {
    return await this.authService.userVerification(dto, userId);
  }

  @ResendVerificationCodeOperation()
  @HttpCode(200)
  @Post(':userId/resend-code')
  async resendVerificationCode(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserResendVerificationCodeResponse> {
    return await this.authService.resendVerificationCode(userId);
  }

  @UserLoginOperation()
  @HttpCode(200)
  @Post('login')
  async userLogin(@Body() dto: UserLoginDto): Promise<UserLoginResponse> {
    return await this.authService.userLogin(dto);
  }

  @UserRefreshOperation()
  @Post('refresh')
  async refresh(
    @Body() dto: UserRefreshTokenDto,
  ): Promise<UserRefreshResponse> {
    return await this.authService.refreshTokens(dto);
  }

  @Post('logout')
  @UserLogoutOperation()
  @HttpCode(200)
  async logout(@Body() dto: UserRefreshTokenDto, @Req() req: FastifyRequest) {
    const accessToken = this.extractAccessToken(req);
    await this.redisService.setTokenWithExpiry(accessToken, accessToken);
    return await this.authService.logoutUser(dto);
  }

  @ForgotPasswordOperation()
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: UserForgotPasswordDto,
  ): Promise<UserForgotPasswordResponse> {
    return await this.authService.forgotPassword(dto);
  }

  @VerifyForgotPasswordOperation()
  @Patch('forgot-password/:userId/verify')
  async verifyForgotPasswordVerificationCode(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UserVerificationDto,
  ): Promise<UserForgotPasswordVerificationResponse> {
    return await this.authService.forgotPasswordVerification(dto, userId);
  }

  @ResetPasswordOperation()
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(
    @CurrentUser() currentUser: UserTokenDto,
    @Body() dto: ResetPasswordDto,
  ): Promise<SuccessMessageType> {
    return await this.authService.resetPassword(dto, currentUser.id);
  }

  @ValidateResetPassword()
  @Get('reset-password')
  async validateResetPasswordLink(
    @Query('resetToken') resetToken: string,
    @Query('userId') userId: string,
  ): Promise<ValidateResetPasswordResponse> {
    return await this.authService.validateResetPasswordLink(resetToken, userId);
  }

  private extractAccessToken(req: FastifyRequest): string {
    const { headers } = req;
    const authorizationHeader = headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('User unauthorized!');
    }
    return authorizationHeader.split(' ')[1];
  }
}
