import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class GetAIMessageDTO{
    // @IsEmpty()
    @IsNotEmpty()
    prompt: string

    @IsString()
    @IsOptional()
    sessionId?: string
}