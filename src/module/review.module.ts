import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { ReviewUseCase } from "src/application/usecases/review.usescase";
import { Review, ReviewSchema } from "src/infrastructure/db/schemas/review.schema";
import { ReviewRepositoryImpl } from "src/infrastructure/repositories/review.repository.impl";
import { ReviewController } from "src/interface/http/review.controller";


@Module({
    imports: [
        MongooseModule.forFeature([
          { name: Review.name, schema: ReviewSchema },
        ]),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule,
      ],
      controllers: [ReviewController],
        providers: [
          ReviewUseCase,
          
          {
            provide: 'ReviewInterface',
            useClass: ReviewRepositoryImpl,
          },
          ReviewRepositoryImpl,
        ],
        exports: []
})
export class ReviewModule {}
