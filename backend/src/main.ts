import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['https://zkwordo.xyz', /http:\/\/localhost:\d+/],
    },
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? '8000');
}
bootstrap();
