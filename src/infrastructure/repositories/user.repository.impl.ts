import {UserInterface} from '../../core/interfaces/user.interface';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserEntity} from '../../core/entities/user.entity';
import { Model, Promise } from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {User, User as UserDocument} from '../db/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../../core/dto/login.dto';
import { RegisterDto } from '../../core/dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Brand, Brand as BrandDocument} from '../db/schemas/brand.schema';
import { Perfume, Perfume as PerfumeDocument } from '../db/schemas/perfume.schema';
import { Favorite } from '../db/schemas/favorite.schema';

@Injectable()
export class UserRepositoryImpl implements UserInterface {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
    @InjectModel(Perfume.name) private perfumeModel: Model<Perfume>,
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
    private readonly jwtService: JwtService,
  ) {}

  async count(): Promise<{ users: number; perfumes: number; brands: number }[]> {
    try {
      const users = await this.userModel.countDocuments({role: 'client'});
      const perfumes = await this.perfumeModel.countDocuments();
      const brands = await this.brandModel.countDocuments();
  
      return [{ users, perfumes, brands }];
    } catch (error) {
    }
  }
  

async verifyToken(token: string) {
    try {
        
      const decoded = this.jwtService.verify(token); 
      
      const user = await this.userModel.findOne({email:decoded.email}); 
    

      if (!user) throw new UnauthorizedException('User not found');
      
      return { email: user.email };
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
  async index(): Promise<UserEntity[]> {
    const users = await this.userModel
      .find({ role: 'client' })
      .select('_id name email role image created_at')
      .lean(); 

    for (const user of users) {
      const likes = await this.favoriteModel.countDocuments({ user: user._id });
      (user as any).likes = likes;
      (user as any).brandCount = user.followedBrands ? user.followedBrands.length : 0;
    }

    return users;
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
            savedUser.image
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

    async update(id: string, userDto: RegisterDto): Promise<{ message: string }> {
        const updateUser = await this.userModel.findByIdAndUpdate(id, userDto, {new: true});
        if(!updateUser){
            throw new Error('there is no user with this id')
        }
        return {message: 'user updated successfully'}
    }

    async followBrand(userId: string, brandId: string): Promise<{ message: string }> {
        const brandExists = await this.brandModel.findById(brandId);
        if (!brandExists) {
          throw new Error('Brand not found');
        }
      
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
      
        if (user.followedBrands.includes(brandId)) {
          return { message: 'Brand already followed' };
        }
      
        user.followedBrands.push(brandId);
        await user.save();
      
        return { message: 'Brand followed successfully' };
      }
      
}
