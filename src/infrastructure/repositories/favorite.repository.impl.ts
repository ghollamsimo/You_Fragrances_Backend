import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from '../db/schemas/favorite.schema';
import { FavoriteInterface } from 'src/core/interfaces/favorite.interface';
import { FavoriteDto } from 'src/core/dto/favorite.dto';

@Injectable()
export class FavoriteRepositoryImpl implements FavoriteInterface {
    constructor(@InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>) {}

    async addFavorite(favoriteDto: FavoriteDto): Promise<Favorite> {
        const favoriteExist = await this.favoriteModel.findOne({
            user: favoriteDto.user,
            perfume: favoriteDto.perfume
        }).exec();
    
        if (favoriteExist) throw new Error('Favorite already exists for this perfume');
    
        return this.favoriteModel.create({
            user: favoriteDto.user,
            perfume: favoriteDto.perfume,
        });
    }
    
    async removeFavorite(userId: string, perfumeId: string): Promise<{ message: string }> {
        await this.favoriteModel.findOneAndDelete({ user: userId, perfume: perfumeId }).exec();
        return { message: 'Favorite removed successfully' };
    }

    async getUserFavorites(userId: string): Promise<any> {
        return this.favoriteModel.find({ user: userId }).populate('perfume', '_id name image brand').exec();
    }
}
