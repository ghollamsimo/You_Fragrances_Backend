import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { MinioService } from "src/application/usecases/minio.usecase";
import { PerfumeUseCase } from "src/application/usecases/perfume.usecase";
import { Brand, BrandModelSchema } from "src/infrastructure/db/schemas/brand.schema";
import {  Perfume, PerfumeSchema } from "src/infrastructure/db/schemas/perfume.schema";
import { Review, ReviewSchema } from "src/infrastructure/db/schemas/review.schema";
import { PerfumeRepositoryImpl } from "src/infrastructure/repositories/perfume.repository.impl";
import { PerfumeController } from "src/interface/http/perfume.controller";


@Module({
    imports: [
        MongooseModule.forFeature([
          { name: Perfume.name, schema: PerfumeSchema },
          { name: Review.name, schema: ReviewSchema },
          { name:  Brand.name, schema: BrandModelSchema },
        ]),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule,
      ],
      controllers: [PerfumeController],
        providers: [
          PerfumeUseCase,
          MinioService,
          {
            provide: 'PerfumeInterface',
            useClass: PerfumeRepositoryImpl,
          },
          PerfumeRepositoryImpl,
        ],
        exports: [MinioService]
})
export class PerfumeModule {}
