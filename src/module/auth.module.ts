import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { User, UserModelSchema } from '../infrastructure/db/schemas/user.schema';
import { UserController } from '../interface/http/user.controller';
import { UserUseCase } from '../application/usecases/user.usecase';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl';
import { JwtAuthGuard } from '../guard/guard';  

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserModelSchema }]),
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UserUseCase,
    {
      provide: 'UserInterface',
      useClass: UserRepositoryImpl,
    },
    UserRepositoryImpl,
    JwtAuthGuard, 
  ],
  exports: [JwtModule], 
})
export class AuthModule {}
