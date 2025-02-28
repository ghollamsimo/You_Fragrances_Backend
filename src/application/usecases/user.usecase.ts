import {Inject, Injectable} from "@nestjs/common";
import {UserInterface} from "../../core/interfaces/user.interface";
import {UserEntity} from "../../core/entities/user.entity";
import { RegisterDto } from "src/core/dto/register.dto";
import { LoginDto } from "src/core/dto/login.dto";
import { MinioService } from "./minio.usecase";

@Injectable()
export class UserUseCase{
    constructor(@Inject('UserInterface') private readonly userRepository: UserInterface,
private readonly minioService: MinioService
) {}

    async execute(registerDto: RegisterDto, file?: Express.Multer.File): Promise<UserEntity> {
        const imageUrl = file ? await this.minioService.uploadFile(file, 'users') : null;
        return await this.userRepository.store({ ...registerDto, image: imageUrl });
    }

    async login(loginDto: LoginDto): Promise<{token: string}>{
        return this.userRepository.login(loginDto);
    }   

    delete(id: string): Promise<{message: string}>{
        return this.userRepository.delete(id);
    }

    update(id: string, registerDto: RegisterDto): Promise<{message: string}>{
        return this.userRepository.update(id, registerDto);
    }

    index(): Promise<UserEntity[]>{
        return this.userRepository.index();
    }

    followBrand(userId: string, brandId: string){
        return this.userRepository.followBrand(userId, brandId)
    }

    count(){
        return this.userRepository.count()
    }

}