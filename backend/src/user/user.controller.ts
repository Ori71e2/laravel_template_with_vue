import { Controller, Post, Response, Body, HttpStatus} from '@nestjs/common';
import { UserService } from './user.service'

@Controller('user')
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
