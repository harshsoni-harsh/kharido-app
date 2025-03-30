import { Logger, Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { Product, ProductSchema } from '@libs/shared/schemas/product.schema';
import { Review, ReviewSchema } from '@libs/shared/schemas/review.schema';
import { Category, CategorySchema } from '@libs/shared/schemas/category.schema';

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        MongooseModule.forRoot(process.env.DB_STRING!, {
          onConnectionCreate() {
            Logger.log('Mongodb connected successfully');
          },
        }),
        MongooseModule.forFeature([
          
          { name: Review.name, schema: ReviewSchema },
          { name: Product.name, schema: ProductSchema },
          { name: Category.name, schema: CategorySchema },
        
        ]),
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
