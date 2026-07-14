import { CategoryRepository } from './category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryQueryParams } from './category.types';
import { ICategory } from './category.interface';
import { ApiError } from '../../utils/ApiError';
import { slugify } from './category.utils';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(data: CreateCategoryDto): Promise<ICategory> {
    const existingCategory = await this.categoryRepository.findByName(data.name);
    if (existingCategory) {
      throw new ApiError(409, 'Category name already exists.');
    }

    const slug = slugify(data.name);
    const existingSlug = await this.categoryRepository.findBySlug(slug);
    if (existingSlug) {
      throw new ApiError(409, 'Category slug already exists.');
    }

    return this.categoryRepository.create({ ...data, slug });
  }

  async getCategoryById(id: string): Promise<ICategory> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<ICategory> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  async getAllCategories(query: CategoryQueryParams): Promise<{ data: ICategory[]; total: number }> {
    return this.categoryRepository.findAll(query);
  }

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<ICategory> {
    const category = await this.getCategoryById(id);

    let slug = category.slug;
    if (data.name && data.name !== category.name) {
      const existingCategory = await this.categoryRepository.findByName(data.name);
      if (existingCategory) {
        throw new ApiError(409, 'Category name already exists.');
      }
      slug = slugify(data.name);
      const existingSlug = await this.categoryRepository.findBySlug(slug);
      if (existingSlug) {
        throw new ApiError(409, 'Category slug already exists.');
      }
    }

    return this.categoryRepository.update(id, { ...data, slug });
  }

  async deleteCategory(id: string): Promise<ICategory> {
    await this.getCategoryById(id);
    return this.categoryRepository.delete(id);
  }
}
