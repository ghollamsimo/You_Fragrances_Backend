import { Module } from '@nestjs/common';
import { ChatbotUseCase } from '../application/usecases/chatbot.usecase';
import { ChatbotController } from '../interface/chatbot.controller';
// import { JwtAuthGuard } from 'src/guard/guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
    // imports: [JwtModule],
  controllers: [ChatbotController],
  providers: [ChatbotUseCase],
  exports: [ChatbotUseCase],
})
export class ChatbotModule {}
