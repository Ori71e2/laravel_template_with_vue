import { Controller, Post, Response, Body, HttpStatus} from '@nestjs/common';
import { UrlService } from './url.service'
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}
  @Post('getList')
  async getList(@Response() res, @Body() body) {
    try {
      let id = 0
      let list:string = await this.urlService.getList(id);
      res.status(HttpStatus.OK).send(list);
    } catch (e) {
      res.status(HttpStatus.NOT_ACCEPTABLE).json(`List ${e} is not found`);
    } 
  }
}
