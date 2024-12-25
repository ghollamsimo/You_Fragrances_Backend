import {UserInterface} from '../../core/interfaces/user.interface';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserEntity} from '../../core/entities/user.entity';
import { Model, Promise } from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {User as UserDocument} from '../db/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../../core/dto/login.dto';
import { RegisterDto } from '../../core/dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserRepositoryImpl implements UserInterface {
    constructor(@InjectModel(UserDocument.name) private userModel: Model<UserDocument> ,     private readonly jwtService: JwtService,
) {}

    async index(): Promise<UserEntity[]> {
        const users = await this.userModel.find().exec(); 
        if (!users) return []; 
            return users.map(
          (user) =>   
            new UserEntity(user.name, user.email, user.role, user.password, user.gender),
        );
      }
    async store(user: RegisterDto): Promise<UserEntity> {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
        const newUser = new this.userModel(user);
        const savedUser = await newUser.save();
        return new UserEntity(
            savedUser.name,
            savedUser.email,
            savedUser.role,
            savedUser.password,
            savedUser.gender,
        );
    }

    async delete(id: string): Promise<{ message: string }> {
        const deleteUser = await this.userModel.findByIdAndDelete(id)
        if(!deleteUser){
            throw new Error('User not found')
        }
        return { message: 'user deleted successfully' };

    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const user = await this.userModel.findOne({ email: loginDto.email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
          }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const token = this.jwtService.sign({ id: user._id, name: user.name, email: user.email });
        return { token };
    }

    update(id: string, userDto: RegisterDto): Promise<{ message: string }> {
        return Promise.resolve({ message: '' });
    }
}
