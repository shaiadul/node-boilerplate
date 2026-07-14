import { PaginationParams } from '../../utils/pagination';

export interface ProductQueryParams extends PaginationParams {
  categoryId?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  inStock?: string | boolean;
}
