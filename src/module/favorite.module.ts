import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { FavoriteUseCase } from "src/application/usecases/favorite.usecase";
import { Favorite, FavoriteSchema } from "src/infrastructure/db/schemas/favorite.schema";
import { FavoriteRepositoryImpl } from "src/infrastructure/repositories/favorite.repository.impl";
import { FavoriteController } from "src/interface/http/favorite.controller";



@Module({
    imports: [
        MongooseModule.forFeature([
          { name: Favorite.name, schema: FavoriteSchema },
        ]),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule,
      ],
      controllers: [FavoriteController],
        providers: [
          FavoriteUseCase,
          {
            provide: 'FavoriteInterface',
            useClass: FavoriteRepositoryImpl,
          },
          FavoriteRepositoryImpl,
        ],
        exports: []
})
export class FavoriteModule {}
