import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlController } from './url/url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot()
  ],
  controllers: [AppController, UrlController, UserController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
