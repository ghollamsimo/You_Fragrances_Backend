import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { MinioService } from "src/application/usecases/minio.usecase";
import { NoteUseCase } from "src/application/usecases/note.usecase";
import {  Note, NoteModelSchema } from "src/infrastructure/db/schemas/note.schema";
import { NoteRepositoryImpl } from "src/infrastructure/repositories/note.repository.impl";
import { NoteController } from "src/interface/http/note.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
          { name: Note.name, schema: NoteModelSchema },
        ]),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule,
      ],
      controllers: [NoteController],
        providers: [
          NoteUseCase,
          MinioService,
          {
            provide: 'NoteInterface',
            useClass: NoteRepositoryImpl,
          },
          NoteRepositoryImpl,
        ],
        exports: [MinioService]
})
export class NoteModule {}
