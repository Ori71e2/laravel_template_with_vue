import { Controller, Post, Response, Body, HttpStatus, UseInterceptors, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Response() res, @Body() body) {
    try {
      let accout: string = body.username
      let password: string = body.password
      let flag: boolean = await this.userService.register(accout, password)
      if (flag) {
        res.status(HttpStatus.CREATED).json('User Register Success!')
      } else {
        res.status(HttpStatus.CONFLICT).json(`Register Failed!`)
      }
    } catch(e) {
      res.status(HttpStatus.CONFLICT).json(`Account ${e} confilict!`)
    }
  }
}
