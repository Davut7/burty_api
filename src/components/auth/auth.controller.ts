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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserRegistrationDto } from './dto/userRegistration.dto';
import { UserLoginDto } from './dto/userLogin.dto';
import { UserVerificationDto } from './dto/userVerification.dto';
import { Cookies } from 'src/common/decorators/getCookie.decorator';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UserTokenDto } from '../token/dto/token.dto';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { UserRegistrationResponse } from './responses/userRegistration.response';
import { UserLoginResponse } from './responses/userLogin.response';
import { UserResendVerificationCodeResponse } from './responses/userResendVerificationCode.response';
import { UserForgotPasswordDto } from './dto/userForgotPassword.dto';
import { UserRegistrationOperation } from './decorators/userRegistrationOperation.decorator';
import { UserVerificationOperation } from './decorators/userVerificationOperation.decorator';
import { ResendVerificationCodeOperation } from './decorators/resendVerificationCodeOperation.decorator';
import { UserLoginOperation } from './decorators/userLoginOperation.decorator';
import { UserRefreshOperation } from './decorators/userRefreshOperation.decorator';
import { UserLogoutOperation } from './decorators/userLogout.decorator';
import { ForgotPasswordOperation } from './decorators/forgotPasswordOperation.decorator';
import { VerifyForgotPasswordOperation } from './decorators/verifyForgotPasswordOperation.decorator';
import { ResetPasswordOperation } from './decorators/resetPasswordOperation.decorator';
import { ValidateResetPassword } from './decorators/validateResetPasswordOperation.decorator';
import { UserVerifyResponse } from './responses/userVerify.response';
import { UserRefreshResponse } from './responses/userRefresh.response';
import { UserForgotPasswordResponse } from './responses/userForgotPassword.response';
import { UserForgotPasswordVerificationResponse } from './responses/userForgotPasswordVerification.response';
import { ValidateResetPasswordResponse } from './responses/validateResetPasswordLink.response';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    const { user, accessToken, refreshToken, message } =
      await this.authService.userVerification(dto, userId);
    return {
      message,
      user,
      accessToken,
      refreshToken,
    };
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
    const { message, user, accessToken, refreshToken } =
      await this.authService.userLogin(dto);
    return {
      message,
      user,
      accessToken,
      refreshToken,
    };
  }

  @UserRefreshOperation()
  @Get('refresh')
  async refresh(
    @Cookies('refreshToken') requestRefreshToken: string,
  ): Promise<UserRefreshResponse> {
    const { message, user, accessToken, refreshToken } =
      await this.authService.refreshTokens(requestRefreshToken);

    return {
      message,
      user,
      accessToken,
      refreshToken,
    };
  }

  @UserLogoutOperation()
  @HttpCode(200)
  @Post('logout')
  async logout(@Cookies('refreshToken') refreshToken: string) {
    return await this.authService.logoutUser(refreshToken);
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
}
