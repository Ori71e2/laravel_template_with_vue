import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlDto } from './url.dto';
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

  async insertOne(url: UrlDto): Promise<boolean> {
    const newUrl = this.urlRepository.create(url);
    return await this.urlRepository.insert(newUrl).then(() => { return true}).catch(() => { return false});
  }


  async deleteOne(url: UrlDto): Promise<boolean> {
    // const { id } = url;
    return await this.urlRepository.delete(url).then(() => { return true}).catch(() => { return false});
  }

  async updateByUserId(url: UrlDto): Promise<boolean> {
    const { id } = url;
    return await this.urlRepository.update({ id }, url).then(() => { return true}).catch(() => { return false});
  }

  async updateTagByUserId(url: UrlDto): Promise<boolean> {
    const { userId, tag} = url;
    return this.urlRepository
    .createQueryBuilder('tag')
    .update()
    .set({ tag: tag })
    .where({ userId: userId })
    .execute()
    .then(() => { return true })
    .catch(() => { return false });
  }

  async updateListByUserId(url: UrlDto): Promise<boolean> {
    const { userId, list} = url;
    return this.urlRepository
    .createQueryBuilder('list')
    .update()
    .set({ list: list })
    .where({ userId: userId })
    .execute()
    .then(() => { return true })
    .catch(() => { return false });
  }
}