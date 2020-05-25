import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Url } from '../entity';

describe('Url Controller', () => {
  let app: INestApplication;
  let urlService = {
    getOneByUserId: (id: number) => { return new Url('list2', 'tag2', 2, 2) },
    updateTagByUserId: (id: number, tag: 'tag1') => { return new Url('list2', 'tag2', 2, 2) },
    updateListByUserId: (id: number, list: 'list1') => { return new Url('list2', 'tag2', 2, 2) },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UrlController],
      providers: [UrlService]
    })
      .overrideProvider(UrlService)
      .useValue(urlService)
      .compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('/POST /url/getOneByUserId', (done) => {
    request(app.getHttpServer())
      .post('/url/getOneByUserId')
      .send({
      })
      .expect(HttpStatus.OK)
      .end((err, res) => {
        console.log(res.body)
        done();
      })
  });

  it('/POST /url/updateTagByUserId', (done) => {
    request(app.getHttpServer())
      .post('/url/updateTagByUserId')
      .send({
        id: 2,
        tag: 'tag1'
      })
      .expect(HttpStatus.OK)
      .end((err, res) => {
        console.log(res.body)
        done();
      })
  });

  it('/POST /url/updateListByUserId', (done) => {
    request(app.getHttpServer())
      .post('/url/updateListByUserId')
      .send({
        id: 2,
        list: 'list1'
      })
      .expect(HttpStatus.OK)
      .end((err, res) => {
        console.log(res.body)
        done();
      })
  });

  afterAll(async () => {
    await app.close();
  })
});
