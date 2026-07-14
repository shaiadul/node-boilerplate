import { PaginationParams } from '../../utils/pagination';
import { OrderStatus } from '@prisma/client';

export interface OrderQueryParams extends PaginationParams {
  status?: OrderStatus;
  userId?: string;
}
