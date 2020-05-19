import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserModule } from './user/user.module';
import { UrlModule } from './url/url.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    UrlModule
  ]
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
