import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(
    cors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    }),
  );

  console.log(`this projet runing in this port : http://localhost:8080`)
  await app.listen(8080)
}
bootstrap();