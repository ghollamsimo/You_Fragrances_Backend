import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { BrandModule } from './brand.module';
import { ChatbotModule } from './chatbot.module';
import { NoteModule } from './note.module';
import { PerfumeModule } from './perfume.module';
import { ReviewModule } from './review.module';
import { FavoriteModule } from './favorite.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        retryAttempts: 5,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
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