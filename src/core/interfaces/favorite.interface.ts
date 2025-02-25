import { Favorite } from "src/infrastructure/db/schemas/favorite.schema";
import { FavoriteDto } from "../dto/favorite.dto";

export interface FavoriteInterface {
    addFavorite(favoriteDto: FavoriteDto): Promise<Favorite>;
    removeFavorite(userId: string, perfumeId: string): Promise<{ message: string }>;
    getUserFavorites(userId: string): Promise<Favorite[]>;
}
