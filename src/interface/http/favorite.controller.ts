import { Controller, Post, Delete, Get, Param, Request, UseGuards } from '@nestjs/common';
import { FavoriteUseCase } from 'src/application/usecases/favorite.usecase';
import { JwtAuthGuard } from 'src/guard/guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteUseCase) {}

    @Post(':perfumeId')
    async addFavorite(@Request() req, @Param('perfumeId') perfumeId: string) {
        return this.favoriteService.addFavorite({ user: req.user.id, perfume: perfumeId });
    }

    @Delete(':perfumeId')
    async removeFavorite(@Request() req, @Param('perfumeId') perfumeId: string) {
        return this.favoriteService.removeFavorite(req.user.id, perfumeId);
    }

    @Get()
    async getUserFavorites(@Request() req) {
        return this.favoriteService.getUserFavorites(req.user.id);
    }
}
