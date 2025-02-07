import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Brand, BrandModelSchema } from 'src/infrastructure/db/schemas/brand.schema';
import { BrandController } from 'src/interface/http/brand.controller';
import { BrandUseCase } from 'src/application/usecases/brand.usecase';
import { BrandRepositoryImpl } from 'src/infrastructure/repositories/brand.repository.impl';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandModelSchema }]),
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    JwtModule
  ],
  controllers: [BrandController],
  providers: [
    BrandUseCase,
    {
      provide: 'BrandInterface',
      useClass: BrandRepositoryImpl,
    },
    BrandRepositoryImpl,
  ],
  exports: [], 
})
export class BrandModule {}
