import { Controller, Post, Body} from '@nestjs/common';

@Controller('url')
export class UrlController {
  @Post('getList')
  getList(@Body() body) {
    console.log(body)
  }
}
