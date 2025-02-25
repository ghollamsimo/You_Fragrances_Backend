import { Injectable, Inject } from '@nestjs/common';
import { FavoriteDto } from 'src/core/dto/favorite.dto';
import { FavoriteInterface } from 'src/core/interfaces/favorite.interface';

@Injectable()
export class FavoriteUseCase {
    constructor(@Inject('FavoriteInterface') private readonly favoriteRepository: FavoriteInterface) {}

    async addFavorite(favoriteDto: FavoriteDto) {
        return this.favoriteRepository.addFavorite({user: favoriteDto.user, perfume: favoriteDto.perfume});
    }

    async removeFavorite(userId: string, perfumeId: string) {
        return this.favoriteRepository.removeFavorite(userId, perfumeId);
    }

    async getUserFavorites(userId: string) {
        return this.favoriteRepository.getUserFavorites(userId);
    }
}
