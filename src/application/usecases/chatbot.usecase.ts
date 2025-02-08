import { ChatSession, GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

const GEMINI_MODEL = 'gemini-1.5-flash'

@Injectable()
export class ChatbotUseCase  {
  private readonly googleAi: GoogleGenerativeAI;
  private readonly model: GenerativeModel
  private chatSessions: { [sessionId: string]: ChatSession } = {}
  private sessionCounters: { [sessionId: string]: number } = {} 
  private readonly logger = new Logger(ChatbotUseCase .name)
  private globalChatHistory: { [sessionId: string]: string[] } = {};

  constructor(configService: ConfigService) {
    const geminiApiKey = configService.get('OPENAI_API_KEY');
    this.googleAi = new GoogleGenerativeAI(geminiApiKey);
    this.model = this.googleAi.getGenerativeModel({
      model: GEMINI_MODEL
    });
  }

  private getChatSession(sessionId: string) {
    let sessionIdToUse = sessionId ?? v4()
    let result = this.chatSessions[sessionIdToUse];
    if (!result) {
      result = this.model.startChat();
      this.chatSessions[sessionIdToUse] = result;
      this.sessionCounters[sessionIdToUse] = 0; 
      this.globalChatHistory[sessionIdToUse] = [];
    }

    return {
      sessionId: sessionIdToUse,
      chat: result
    }
  }

  async generatePerfumeAdvice(data: { sessionId: string, prompt: string }) {
    try {
      const { sessionId, chat } = this.getChatSession(data.sessionId);

      this.sessionCounters[sessionId]++;

      this.globalChatHistory[sessionId].push(`User: ${data.prompt}`);

      if (this.sessionCounters[sessionId] > 5) {
        return {
          result: "You've used this service more than 5 times. Please subscribe for continued access.",
          sessionId
        };
      }

      const prompt = `You are a perfume expert. ${data.prompt}`;
      const result = await chat.sendMessage(prompt);

      const fullResponse = await result.response.text();

      const summaryPrompt = `Please summarize the following response in one or two sentences: ${fullResponse}`;
      const summaryResult = await chat.sendMessage(summaryPrompt);
      const summary = await summaryResult.response.text();

      this.globalChatHistory[sessionId].push(`AI : ${summary}`);

      return {
        result: summary, 
        sessionId
      };
    } catch (error) {
      this.logger.error("ERROR sending message to Gemini API for perfumes", error);
      throw error;
    }
  }

  getGlobalChatHistory() {
    return this.globalChatHistory;
  }
}
