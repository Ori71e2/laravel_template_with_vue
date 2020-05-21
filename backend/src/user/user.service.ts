import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { User } from '../entity';
import { userInfo } from 'os';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async register(account: string, password: string): Promise<boolean> {
    let user = new User();
    user.name = 'caixie';
    user.account = account;
    user.password = password;
    user.vip = 0;
    user.vipExpiretime = 0;
    user.activeCode = 0;
    user.activeCodeExpiretime = 0;
    user.isActive = false;
    let flag: boolean = false
    await this.userRepository.insert(user).then(() => { flag = true }).catch(() => { flag = false})
    return flag
  }
}