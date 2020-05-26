import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
// import { UrlDto } from './url.dto';
import { Url } from '../entity';
import { Repository, getRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { testAppModule } from '../entity';

const urlArray = [
  new Url('list2', 'tag2', 2, 2),
  new Url('list3', 'tag3', 3, 3),
  new Url('list4', 'tag4', 4, 4),
];

const testUserId1 = 1;
const oneUrl = new Url('list1', 'tag1', 1, testUserId1);

describe('Url Service', () => {
  let service: UrlService;
  let repo: Repository<Url>;
  let urlService = {
    create: jest.fn().mockReturnValue(oneUrl),
    find: jest.fn().mockResolvedValue(urlArray),
    findOneOrFail: jest.fn().mockResolvedValue(oneUrl),
    save: jest.fn(),
    insert: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(true),
    createQueryBuilder: jest.fn(() => ({
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(true)
    }))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [testAppModule],
      // imports: [],
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useValue: urlService
        }
      ]
    })
      .compile();
    service = module.get<UrlService>(UrlService);
    repo = module.get<Repository<Url>>(getRepositoryToken(Url));
  });
  it('init service', () => {
    expect(service).toBeDefined();
  });
  describe('get one list', () => {
    it('get one list', async (done) => {
      const repoSpy = jest.spyOn(repo, 'findOneOrFail');
      expect(service.getOneByUserId(0)).resolves.toEqual(oneUrl);
      expect(repoSpy).toBeCalledWith({ id: 0 });
      done();
    });
  })

  describe('insert one list', () => {
    it('insert one list', async (done) => {
      expect(
        service.insertOne({
          list: 'list1', 
          tag: 'tag1',
          updatetime: 1, 
          userId: testUserId1
        })
      ).resolves.toEqual(true);
      expect(repo.insert).toBeCalledTimes(1);
      done();
    });
  })

  describe('update tag and list by user id', () => {
    it('update tag and list', async (done) => {
      expect(
        service.updateByUserId({
          list: 'list1',
          tag: 'tag1',
          userId: testUserId1
        })
      ).resolves.toEqual(true);
      expect(repo.update).toBeCalledTimes(1);
      done();
    });
  })

  describe('update tag by user id', () => {
    it('update tag', async (done) => {
      expect(
        service.updateListByUserId({
          tag: 'tag1',
          userId: testUserId1
        })
      ).resolves.toEqual(true);
      expect(repo.createQueryBuilder).toBeCalledTimes(1);
      done();
    });
  })

  describe('update list by user id', () => {
    it('update list', async (done) => {
      expect(
        service.updateListByUserId({
          list: 'list1',
          userId: testUserId1
        })
      ).resolves.toEqual(true);
      expect(repo.createQueryBuilder).toBeCalledTimes(2);
      done();
    });
  })
  // it('addList', async (done) => {
  //   let res = await service.addList(0)
  //   expect(res).toEqual(true);
  // });
})
