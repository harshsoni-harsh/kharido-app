import { Module } from '@nestjs/common';
import { PublicService } from './public.service';

@Module({
  providers: [PublicService],
})
export class PublicModule {}
