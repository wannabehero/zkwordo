import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { ImageModule } from './image/image.module';
import { MetadataModule } from './metadata/metadata.module';
import { LoggerMiddleware } from './middlewares/LoggerMiddleware';
import { ProofModule } from './proof/proof.module';
import { Web3Module } from './web3/web3.module';
import { WordsModule } from './words/words.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    Web3Module,
    ThrottlerModule.forRoot(),
    MetadataModule,
    ImageModule,
    ProofModule,
    WordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
