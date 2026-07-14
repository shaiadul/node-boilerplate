import { ProductRepository } from './product.repository';
import { CategoryRepository } from '../categories/category.repository';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductQueryParams } from './product.types';
import { IProduct } from './product.interface';
import { ApiError } from '../../utils/ApiError';
import { generateProductSlug } from './product.utils';

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async createProduct(data: CreateProductDto): Promise<IProduct> {
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    const slug = generateProductSlug(data.name);
    const existingProduct = await this.productRepository.findBySlug(slug);
    if (existingProduct) {
      throw new ApiError(409, 'Product slug already exists. Please choose a unique name.');
    }

    return this.productRepository.create({ ...data, slug });
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async getProductBySlug(slug: string): Promise<IProduct> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async getAllProducts(query: ProductQueryParams): Promise<{ data: IProduct[]; total: number }> {
    return this.productRepository.findAll(query);
  }

  async updateProduct(id: string, data: UpdateProductDto): Promise<IProduct> {
    const product = await this.getProductById(id);

    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
    }

    let slug = product.slug;
    if (data.name && data.name !== product.name) {
      slug = generateProductSlug(data.name);
      const existingProduct = await this.productRepository.findBySlug(slug);
      if (existingProduct && existingProduct.id !== id) {
        throw new ApiError(409, 'Product slug already exists. Please choose a unique name.');
      }
    }

    return this.productRepository.update(id, { ...data, slug });
  }

  async deleteProduct(id: string): Promise<IProduct> {
    await this.getProductById(id);
    return this.productRepository.delete(id);
  }
}
