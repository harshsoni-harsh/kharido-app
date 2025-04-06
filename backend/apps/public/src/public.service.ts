import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Category } from '@shared/schemas/category.schema';
import { Product } from '@shared/schemas/product.schema';
import { Review } from '@shared/schemas/review.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PublicService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>
  ) { }

  async getProduct(productId: string) {
    Logger.log(productId)

    const cleanId = productId.toString().trim();
  
    if (!/^[0-9a-fA-F]{24}$/.test(cleanId)) {
      Logger.error(`Invalid ID format received: ${cleanId}`);
      return {
        success: false,
        statusCode: 400,
        message: 'Invalid product ID format',
        data: null,
      };
    }
    try {
     
      const objectId = new Types.ObjectId(productId);

      const product = await this.productModel.findById(objectId).lean().exec();

      if (!product) {
        return {
          success: false,
          statusCode: 404,
          message: 'Product not found',
          data: null,
        };
      }

      
      const reviews = await this.reviewModel.aggregate([
        { $match: { product: objectId } },
        { $project: { __v: 0 } } // Exclude version key
      ]).exec();

      // 4. Combine results
      const result = {
        ...product,
        reviews: reviews || [], // Ensure reviews is always an array
      };

      return {
        success: true,
        statusCode: 200,
        message: 'Product retrieved successfully',
        data: result,
      };

    } catch (error) {
      console.error(`PublicService.getProduct error: ${error.message}`, error.stack);
      return {
        success: false,
        statusCode: 500,
        message: 'Internal server error while fetching product',
        data: null,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      };
    }
  }
  //getting list of products within given index range
  async getProductsRange(startIndex: number, endIndex: number) {
    if (isNaN(startIndex) || isNaN(endIndex)) {
      return {
        success: false,
        statusCode: 400,
        message: 'Invalid index parameters',
        data: null,
      };
    }
  
    if (startIndex < 0 || endIndex < 0 || startIndex > endIndex) {
      return {
        success: false,
        statusCode: 400,
        message: 'Invalid index range',
        data: null,
      };
    }
  
    const limit = endIndex - startIndex + 1;
    
    try {
      const products = await this.productModel
        .find()
        .skip(startIndex)
        .limit(limit)
        .lean()
        .exec();
  
      const totalProducts = await this.productModel.countDocuments();

      return {
        success: true,
        statusCode: 200,
        message: 'Products retrieved successfully',
        data: {
          products: products || [],
          pagination: {
            currentCount: products.length,
            totalCount: totalProducts,
            currentRange: `${startIndex}-${Math.min(endIndex, totalProducts - 1)}`,
            remaining: Math.max(0, totalProducts - endIndex - 1)
          }
        }
      };
  
    } catch (error) {
      console.error(`PublicService.getProductsRange error: ${error.message}`, error.stack);
      
      return {
        success: false,
        statusCode: 500,
        message: 'Internal server error while fetching products',
        data: null,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      };
    }
  }


  
  

  //categories

  async getCategories(){
    try{
      const categories = await this.categoryModel.find().lean().exec();

      return {
        success: true,
        statusCode: 200,
        message: 'Products retrieved successfully',
        data: {
          categories: categories || [],
          count: categories.length
          
        }
      };

    }
    catch (error) {
      console.error(`PublicService.getProductsRange error: ${error.message}`, error.stack);
      
      return {
        success: false,
        statusCode: 500,
        message: 'Internal server error while fetching categories',
        data: null,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      };
    }

  }

  async getCategoryProducts(categoryId: string) {
    if (!Types.ObjectId.isValid(categoryId)) {
      return {
        success: false,
        statusCode: 400,
        message: 'Invalid category ID format',
        data: null,
      };
    }
  
    try {
      const objectId = new Types.ObjectId(categoryId);
      
      const categoryExists = await this.categoryModel.exists({ _id: objectId });
      if (!categoryExists) {
        return {
          success: false,
          statusCode: 404,
          message: 'Category not found',
          data: null,
        };
      }
  
      // products pagination-ready query
      const products = await this.productModel
        .find({ category: objectId })
        .select('_id name brand price imageLinks rating') // essential fields only
        .lean()
        .exec();
  
      // Get count for pagination metadata
      const productCount = await this.productModel.countDocuments({ category: objectId });
  
      return {
        success: true,
        statusCode: 200,
        message: 'Category products retrieved successfully',
        data: {
          products: products || [],
          metadata: {
            category: categoryExists,
            count: productCount
          }
        }
      };
  
    } catch (error) {
      console.error(`PublicService.getCategoryProducts error: ${error.message}`, error.stack);
      
      return {
        success: false,
        statusCode: 500,
        message: 'Internal server error while fetching category products',
        data: null,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      };
    }
  }


  //search fuzzy

  async searchByUserInput(userInput: string, limit: number = 10) {

    if (!userInput || typeof userInput !== 'string') {
      return {
        success: false,
        statusCode: 400,
        message: 'Invalid search input',
        data: null
      };
    }
  
    try {
     
      await this.productModel.collection.createIndex(
        { searchTags: 'text' },
        { 
          name: 'searchTags_text',
          weights: { searchTags: 1 },
          default_language: 'english',
          collation: { locale: 'en', strength: 2 } 
        }
      );
  
      // 3. Perform fuzzy search with aggregation
      const results = await this.productModel.aggregate([
        {
          $match: {
            $text: {
              $search: userInput,
              $caseSensitive: false,
              $diacriticSensitive: false
            }
          }
        },
        {
          $addFields: {
            score: { $meta: 'textScore' } 
          }
        },
        {
          $sort: { score: -1 } 
        },
        {
          $limit: limit
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            images: 1,
            score: 1,
            matchScore: {
              $divide: [
                { $meta: 'textScore' },
                { $size: { $ifNull: ['$searchTags', []] } }
              ]
            }
          }
        }
      ]);
  
      return {
        success: true,
        statusCode: 200,
        message: 'Search completed successfully',
        data: {
          query: userInput,
          results: results || [],
          count: results.length
        }
      };
  
    } catch (error) {
      console.error(`PublicService.searchByUserInput error: ${error.message}`, error.stack);
      
      return {
        success: false,
        statusCode: 500,
        message: 'Search operation failed',
        data: null,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }

  //custom query and custom sort , limit, page 

  async searchProducts(
    query: string,
    sortOptions?: {
      field: string;
      order: 'asc' | 'desc';
    },
    limit: number = 10,
    page: number = 1
  ) {
    if (!query || typeof query !== 'string') {
      return {
        success: false,
        statusCode: 400,
        message: 'Search query is required',
        data: null
      };
    }
  
    try {
      const filter = {
        $or: [
          { name: { $regex: query, $options: 'i' } }, 
          { description: { $regex: query, $options: 'i' } },
          { searchTags: { $elemMatch: { $regex: query, $options: 'i' } } }
        ]
      };
  
     
      const sort = sortOptions 
        ? { [sortOptions.field]: sortOptions.order === 'asc' ? 1 : -1 }
        : {};
  
      
      const [results, totalCount] = await Promise.all([
        this.productModel
          .find(filter)
          .sort(sort as any)
          .skip((page - 1) * limit)
          .limit(limit)
          .select('_id name price brand imageLinks rating') 
          .exec(),
        
        this.productModel.countDocuments(filter)
      ]);
  
      return {
        success: true,
        statusCode: 200,
        message: 'Search completed successfully',
        data: {
          query,
          results,
          pagination: {
            total: totalCount,
            page,
            pages: Math.ceil(totalCount / limit),
            limit
          },
          sort: sortOptions || { field: 'none', order: 'none' }
        }
      };
  
    } catch (error) {
      console.error(`ProductService.searchProducts error: ${error.message}`, error.stack);
      
      return {
        success: false,
        statusCode: 500,
        message: 'Search operation failed',
        data: null,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }
  
  // //fuzzy + filter
  // async searchnFilterByUserInput(){

  // }

  // //filter by property

  // async filterbyProp(){

  // }

  // async filterByCat(){
    
  // }



 
}
