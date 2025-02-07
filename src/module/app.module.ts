import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { BrandModule } from './brand.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/youFragrances'),   
    AuthModule,
    BrandModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
