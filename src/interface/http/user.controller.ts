import {Body, Controller, Post} from "@nestjs/common";
import {UserUseCase} from "../../application/usecases/user.usecase";
import {User} from "../../core/entities/user.entity";

@Controller('users')
export class UserController {
    constructor(private readonly UserUseCase: UserUseCase) {}

    @Post()
    async store(@Body() body: {name: string; email: string; password: string, gender: string, phone: number}): Promise<User>{
        return await this.UserUseCase.execute(body.name, body.email, body.password, body.gender, body.phone)
    }
}