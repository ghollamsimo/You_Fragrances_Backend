import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { BrandModule } from './brand.module';
import { ChatbotModule } from './chatbot.module';
import { NoteModule } from './note.module';
import { PerfumeModule } from './perfume.module';
import { ReviewModule } from './review.module';
import { FavoriteModule } from './favorite.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/youFragrances'),
    ConfigModule.forRoot({isGlobal: true}),
    AuthModule,
    BrandModule,
    ChatbotModule,
    NoteModule,
    PerfumeModule,
    ReviewModule,
    FavoriteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
