import { ChatSession, GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

const GEMINI_MODEL = 'gemini-1.5-flash';

@Injectable()
export class ChatbotUseCase {
  private readonly googleAi: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private chatSessions: { [sessionId: string]: ChatSession } = {};
  private sessionCounters: { [sessionId: string]: number } = {}; 
  private readonly logger = new Logger(ChatbotUseCase.name);
  private globalChatHistory: { [sessionId: string]: string[] } = {};
  private MAX_FREE_MESSAGES: number;

  constructor(configService: ConfigService) {
    const geminiApiKey = configService.get('OPENAI_API_KEY');
    this.MAX_FREE_MESSAGES = Number(configService.get('MAX_FREE_MESSAGES')) || 5; 

    this.googleAi = new GoogleGenerativeAI(geminiApiKey);
    this.model = this.googleAi.getGenerativeModel({
      model: GEMINI_MODEL,
    });
  }

  private getChatSession(sessionId?: string) {
    let sessionIdToUse = sessionId ?? v4();
    if (!this.chatSessions[sessionIdToUse]) {
      this.chatSessions[sessionIdToUse] = this.model.startChat();
      this.sessionCounters[sessionIdToUse] = 0;
      this.globalChatHistory[sessionIdToUse] = [];
    }
    return { sessionId: sessionIdToUse, chat: this.chatSessions[sessionIdToUse] };
  }

  async generatePerfumeAdvice(data: { sessionId: string, prompt: string }) {
    try {
      const { sessionId, chat } = this.getChatSession(data.sessionId);
      this.sessionCounters[sessionId]++;

      // Enregistrer l'historique
      this.globalChatHistory[sessionId].push(`User: ${data.prompt}`);

      // Vérifier la limite de messages gratuits
      if (this.sessionCounters[sessionId] > this.MAX_FREE_MESSAGES) {
        return {
          chatbotMessages: [{ id: v4(), text: "You've used this service more than 5 times. Please subscribe for continued access.", sender: "bot" }],
          sessionId
        };
      }

      const prompt = `
        You are a perfume expert. List at least 1 perfumes or more than one that contain ingredients as a prominent note. 
        For each perfume, provide:
        - Name
        - Brand
        - Main scent notes
        ${data.prompt}
      `;

      const result = await chat.sendMessage(prompt);

      const fullResponse = await result.response.text();
      this.globalChatHistory[sessionId].push(`AI: ${fullResponse}`);

      return {
        chatbotMessages: [{ id: v4(), text: fullResponse, sender: "bot" }],
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
