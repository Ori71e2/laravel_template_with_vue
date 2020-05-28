import * as bcrypt from 'bcryptjs'; 
import * as nodemailer from 'nodemailer';
import {default as config} from '../config';
import { Injectable, HttpException, HttpStatus, HttpService } from '@nestjs/common';
import { JWTService } from './jwt.service';
import { User } from '../entity';
import { Email } from '../entity';
import { UserDto } from '../user/dto/user.dto';
import { EmailDto } from './dto/email.dto';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Email) private readonly emailRepository: Repository<Email>,
    private readonly jwtService: JWTService
  ) {}

  async validateLogin(email, password) {
    let user = await this.userRepository.findOne({ email: email});
    if(!user) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    if(!user.email) throw new HttpException('LOGIN.EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN);

    let isValidPass = await bcrypt.compare(password, user.password);

    if(isValidPass){
      let accessToken = await this.jwtService.createToken(email, user.roles);
      return { token: accessToken, user: user}
    } else {
      throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED);
    }
  }
  async createEmailToken(email: string): Promise<boolean> {
    let emailVerification = await this.emailRepository.findOne({email: email}); 
    if (emailVerification){
      if ((new Date().getTime() - emailVerification.timestamp) / 60000 < 15 ) {
        throw new HttpException('LOGIN.EMAIL_SENDED_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        emailVerification.emailToken  = Math.floor(Math.random() * (9000000)) + 1000000; //Generate 7 digits number
        emailVerification.timestamp = new Date().getTime()
        return await this.emailRepository.save(emailVerification).then(() => { return true}).catch(() => { return false});
      }
    } else {
      let newEmail = this.emailRepository.create(new Email());
      newEmail.email = email
      newEmail.emailToken  = Math.floor(Math.random() * (9000000)) + 1000000; //Generate 7 digits number
      newEmail.timestamp = new Date().getTime()
      return await this.emailRepository.insert(newEmail).then(() => { return true}).catch(() => { return false});
    }
  }

  async sendEmailVerification(email: string): Promise<boolean> {   
    let Verification = await this.emailRepository.findOne({ email: email});

    if(Verification && Verification.emailToken){
        let transporter = nodemailer.createTransport({
            host: config.mail.host,
            port: config.mail.port,
            secure: config.mail.secure, // true for 465, false for other ports
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            }
        });
    
        let mailOptions = {
          from: '"Company" <' + config.mail.user + '>', 
          to: email, // list of receivers (separated by ,)
          subject: 'Verify Email', 
          text: 'Verify Email', 
          html: 'Hi! <br><br> Thanks for your registration<br><br>'+
          '<a href='+ config.host.url + ':' + config.host.port +'/auth/email/verify/'+ Verification.emailToken + '>Click here to activate your account</a>'  // html body
        };
    
        var sent = await new Promise<boolean>(async function(resolve, reject) {
          return await transporter.sendMail(mailOptions, async (error, info) => {
              if (error) {      
                console.log('Message sent: %s', error);
                return reject(false);
              }
              console.log('Message sent: %s', info.messageId);
              resolve(true);
          });      
        })

        return sent;
    } else {
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }

  async verifyEmail(token: number): Promise<boolean> {
    let emailVerif = await this.emailRepository.findOne({ emailToken: token});
    if(emailVerif && emailVerif.email){
      var user = await this.userRepository.findOne({ email: emailVerif.email});
      if (user) {
        user.isActive = true;
        let p1= await this.userRepository.save(user);
        let p2 = await this.emailRepository.remove(emailVerif);
        return Promise.all([p1, p2]).then(() => { return true }).catch(() => { return false });
      }
    } else {
      throw new HttpException('LOGIN.EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
    }
  }
}
