import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly photoRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.photoRepository.find();
  }
}