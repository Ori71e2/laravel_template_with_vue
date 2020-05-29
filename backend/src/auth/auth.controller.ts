import { Controller, Post, HttpStatus, HttpCode, Get, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './interfaces/login.interface';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService ) {}

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() login: Login): Promise<IResponse> {
    try {
      var response = await this.authService.validateLogin(login.email, login.password);
      return new ResponseSuccess("LOGIN.SUCCESS", response);
    } catch(error) {
      return new ResponseError("LOGIN.ERROR", error);
    }
  }

  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    try {
      let newUser = await this.userService.register(createUserDto);
      await this.authService.createEmailToken(newUser.email);
      let sent = await this.authService.sendEmailVerification(newUser.email);
      if(sent){
        return new ResponseSuccess("REGISTRATION.USER_REGISTERED_SUCCESSFULLY");
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error){
      return new ResponseError("REGISTRATION.ERROR.GENERIC_ERROR", error);
    }
  }

  @Get('email/verify/:token')
  public async verifyEmail(@Param() params): Promise<IResponse> {
    try {
      var isEmailVerified = await this.authService.verifyEmail(params.token);
      return new ResponseSuccess("LOGIN.EMAIL_VERIFIED", isEmailVerified);
    } catch(error) {
      return new ResponseError("LOGIN.ERROR", error);
    }
  }
}
