import { Module } from '@nestjs/common';
import { MetadataModule } from './metadata/metadata.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [MetadataModule, ImageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
