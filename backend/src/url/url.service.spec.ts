import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
// import { UrlDTO } from './url.dto';
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
      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith({
        list: 'list1', 
        tag: 'tag1',
        updatetime: 1, 
        userId: testUserId1
      })
      done();
    });
  })
  // it('addList', async (done) => {
  //   let res = await service.addList(0)
  //   expect(res).toEqual(true);
  // });
});
