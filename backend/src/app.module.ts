import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MetadataModule } from './metadata/metadata.module';
import { ImageModule } from './image/image.module';
import { ProofModule } from './proof/proof.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerMiddleware } from './middlewares/LoggerMiddleware';
import { WordsModule } from './words/words.module';
import { Web3Module } from './web3/web3.module';

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
