import {UserEntity} from '../entities/user.entity'
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

export interface UserInterface {
    store(user: RegisterDto): Promise<UserEntity>
    login(loginDto: LoginDto): Promise<{token: string}>
    index(): Promise<UserEntity[]>
    update(id:string, userDto: RegisterDto): Promise<{message: string}>
    delete(id:string): Promise<{ message: string }>
    followBrand(userId: string, brandId: string): Promise<{ message: string }>
}