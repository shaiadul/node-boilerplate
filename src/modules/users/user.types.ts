import { PaginationParams } from '../../utils/pagination';
import { Role } from '@prisma/client';

export interface UserQueryParams extends PaginationParams {
  role?: Role;
  isVerified?: boolean;
}
