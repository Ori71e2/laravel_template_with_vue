import { Controller, Post, Response, Body, HttpStatus} from '@nestjs/common';
import { UrlService } from './url.service'
import { UrlDto } from './url.dto';
import { Url } from '../entity';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}
  @Post('getOneByUserId')
  async getOneByUserId(@Response() res, @Body() body) {
    try {
      let id = 0
      let url: Url = await this.urlService.getOneByUserId(id);
      res.status(HttpStatus.OK).json(url.list);
    } catch (e) {
      res.status(HttpStatus.NOT_ACCEPTABLE).json(`List ${e} is not found`);
    } 
  }

  @Post('updateTagByUserId')
  async updateTagByUserId(@Response() res, @Body() body) {
    let url: UrlDto = { id: 0, tag: body.tag }
    res.status(HttpStatus.OK).json(await this.urlService.updateTagByUserId(url));
  }

  @Post('updateListByUserId')
  async updateListByUserId(@Response() res, @Body() body) {
    let url: UrlDto = { id: 0, list: body.list }
    res.status(HttpStatus.OK).json(await this.urlService.updateListByUserId(url));
  }
}
