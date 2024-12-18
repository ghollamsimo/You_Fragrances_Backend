import {Inject, Injectable} from "@nestjs/common";
import {UserInterface} from "../../core/interfaces/user.interface";
import {User} from "../../core/entities/user.entity";

@Injectable()
export class UserUseCase{
    constructor(@Inject('UserInterface') private readonly userRepository: UserInterface) {}

    async execute(name: string, email: string, password: string, gender: string, phone: number): Promise<User> {
        const user = new User(name, email, password, gender, phone);
        return await this.userRepository.store(user);
    }
}