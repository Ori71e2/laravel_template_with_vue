import { Controller, Post, Response, Body, HttpStatus} from '@nestjs/common';
import { UrlService } from './url.service'
import { Url } from '../entity';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}
  @Post('getList')
  async getList(@Response() res, @Body() body) {
    try {
      let id = 0
      let url: Url = await this.urlService.getOneByUserId(id);
      res.status(HttpStatus.OK).json(url.list);
    } catch (e) {
      res.status(HttpStatus.NOT_ACCEPTABLE).json(`List ${e} is not found`);
    } 
  }
}
