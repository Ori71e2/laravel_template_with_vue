import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { User } from '../entity';
import { userInfo } from 'os';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({email: email});
  }

  async register(newUser: CreateUserDto): Promise<User> {
    let user = new User();
    user.name = newUser.name;
    user.email = newUser.email;
    user.password = newUser.password;
    user.vip = 0;
    user.vipExpiretime = 0;
    user.activeCode = 0;
    user.activeCodeExpiretime = 0;
    user.isActive = false;

    if(this.isValidEmail(newUser.email) && newUser.password){
      var userRegistered = await this.findByEmail(newUser.email);
      if(!userRegistered){
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);
        user.roles = JSON.stringify(["User"]);
        return await this.userRepository.save(user);
      } else if (!userRegistered.email) {
        return userRegistered;
      } else {
        throw new HttpException('REGISTRATION.USER_ALREADY_REGISTERED', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException('REGISTRATION.MISSING_MANDATORY_PARAMETERS', HttpStatus.FORBIDDEN);
    }
  }

  isValidEmail (email : string){
    if(email){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false
  }
}