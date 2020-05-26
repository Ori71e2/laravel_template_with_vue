import * as jwt from 'jsonwebtoken';
import {default as config} from '../config';
import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { UserDto } from '../user/user.dto';
import { User } from '../entity';
@Injectable()
export class JWTService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createToken(email, roles) {
    const expiresIn = config.jwt.expiresIn,
      secretOrKey = config.jwt.secretOrKey;
    const userInfo = { email: email, roles: roles};
    const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  async validateUser(signedUser): Promise<User> {
    var userFromDb = await this.userRepository.findOne({ account: signedUser.email});
    if (userFromDb) {
        return userFromDb;
    }
    return null;
  }


}
