import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { IngredientUseCase } from "src/application/usecases/ingredient.usecase";
import { MinioService } from "src/application/usecases/minio.usecase";
import { Ingredient, IngredientSchema } from "src/infrastructure/db/schemas/ingredient.schema";
import { IngredientRepositoryImpl } from "src/infrastructure/repositories/ingredient.repository.impl";
import { IngredientController } from "src/interface/http/ingredient.controller";



@Module({
    imports: [
        MongooseModule.forFeature([
          { name: Ingredient.name, schema: IngredientSchema },
        ]),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [IngredientController],
        providers: [
          IngredientUseCase,  
          MinioService,
          
          {
            provide: 'IngredientInterface',
            useClass: IngredientRepositoryImpl,
          },
          IngredientRepositoryImpl,
        ],
        exports: [MinioService]
})
export class IngredientModule {}
