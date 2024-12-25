import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/youFragrances'),   
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
