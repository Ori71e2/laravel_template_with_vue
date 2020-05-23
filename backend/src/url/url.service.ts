import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlDTO } from './url.dto';
import { Url } from '../entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async getOneByUserId(id: number): Promise<Url> {
    let url: Url = await this.urlRepository.findOneOrFail({ id });
    return url;
  }

  async insertOne(url: UrlDTO): Promise<boolean> {
    let flag: boolean
    const newUrl = this.urlRepository.create(url);
    try {
      await this.urlRepository.save(newUrl)
      flag = true
    } catch(e) {
      console.log(e)
      flag = false
    }
    return flag
  }
}