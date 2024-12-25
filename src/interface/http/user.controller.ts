import { Body, Controller, Post } from "@nestjs/common";
import { UserUseCase } from "../../application/usecases/user.usecase";
import { UserEntity } from "../../core/entities/user.entity";
import { RegisterDto } from "src/core/dto/register.dto";
import { LoginDto } from "src/core/dto/login.dto";
import { emit } from "process";

@Controller('users')
export class UserController {
    constructor(private readonly userUseCase: UserUseCase) {}

    @Post('/store')
    async store(@Body() body: RegisterDto): Promise<UserEntity> {
        return await this.userUseCase.execute(body);
    }

    @Post("login")
    async login(
      @Body() body: { email: string; password: string }
    ): Promise<{ token: string }> {
      const loginDto = new LoginDto(body.email, body.password);
      return this.userUseCase.login(loginDto);
    }
  
}
