import { PaginationParams } from '../../utils/pagination';

export interface CategoryQueryParams extends PaginationParams {
  search?: string;
}
