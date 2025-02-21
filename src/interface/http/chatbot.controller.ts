import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { ChatbotUseCase } from '../../application/usecases/chatbot.usecase';
import { JwtAuthGuard } from 'src/guard/guard';
import { GetAIMessageDTO } from 'src/core/dto/get-ai-response.dto';
import { v4 as uuidv4 } from 'uuid'; 

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotUseCase) {}

  @Post('message')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getResponse(@Body() data: GetAIMessageDTO) {
    const sessionId = data.sessionId || uuidv4();
        return await this.chatbotService.generatePerfumeAdvice({ sessionId, prompt: data.prompt });
  }
  @Get('history')
  getHistoryChats(){
    const history = this.chatbotService.getGlobalChatHistory()
    return {history}
  }
}
