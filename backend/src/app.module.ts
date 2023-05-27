import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MetadataModule } from './metadata/metadata.module';
import { ImageModule } from './image/image.module';
import { ProofModule } from './proof/proof.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerMiddleware } from './middlewares/LoggerMiddleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot(),
    MetadataModule,
    ImageModule,
    ProofModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
