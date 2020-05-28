import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { JWTService } from './jwt.service';
import { User, Email } from '../entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Email]),
  ],
  providers: [AuthService, UserService, JWTService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule implements NestModule{
  public configure(consumer: MiddlewareConsumer) {
    consumer
     .apply(LoggerMiddleware)
     // .exclude(
     //   { path: 'example', method: RequestMethod.GET },
     // )
     .forRoutes(AuthController);
  }
}
