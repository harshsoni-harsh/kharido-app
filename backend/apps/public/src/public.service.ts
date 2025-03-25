import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Product } from 'apps/libs/shared/schemas/product.schema';
import { Review } from 'apps/libs/shared/schemas/review.schema';
import { Model } from 'mongoose';

@Injectable()
export class PublicService {
  constructor(
    @InjectModel('Product') private readonly ProductModel: Model<Product>,
    @InjectModel('Review') private readonly reviewModel: Model<Review>
  ) { }

  //product
  //single product
  async getProduct(){

  }
  //getting list of products within given index range
  async getProductsRange(startIndex:number,endIndex:number){

  }


  //review

  async getProductReviews(product:string){

  }


  //categories

  async getCategories(){

  }

  async getCategory(){

  }


  //search

  // fuzzy search for user input
  async searchByUserInput(){

  }

  //fuzzy + filter
  async searchnFilterByUserInput(){

  }

  //filter by property

  async filterbyProp(){

  }

  async filterByCat(){
    
  }

 
}
