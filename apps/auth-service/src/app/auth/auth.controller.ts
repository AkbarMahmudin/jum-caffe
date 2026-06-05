import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { CreateNewAccessTokenDto } from './dto/create-new-access-token.dto';
import { AuthLogoutDto } from './dto/auth-logout.dto';
import { AuthUser, CurrentUser, JwtAuthGuard } from '@jum-caffe/common';

@ApiTags({
  name: 'Auth',
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDto) {
    const user = await this.authService.validateUser(email, password);

    return this.authService.login(user);
  }

  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async logout(@Body() { refreshToken }: CreateNewAccessTokenDto) {
    await this.authService.logout(refreshToken);
  }

  @Put('refresh')
  async refresh(@Body() { refreshToken }: AuthLogoutDto) {
    return this.authService.getNewAccessToken(refreshToken);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: AuthUser) {
    return this.authService.profile(user.sub);
  }
}
