import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModelSchema } from '../infrastructure/db/schemas/user.schema';
import { UserController } from '../interface/http/user.controller';
import { UserUseCase } from '../application/usecases/user.usecase';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/usermanagements'),
    MongooseModule.forFeature([{ name: User.name, schema: UserModelSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserUseCase,
    {
      provide: 'UserInterface',
      useClass: UserRepositoryImpl,
    },
  ],
})
export class AppModule {}
