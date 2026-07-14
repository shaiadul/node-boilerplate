export interface PaginationParams {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationOptions {
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getPaginationOptions = (params: PaginationParams): PaginationOptions => {
  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.max(1, Math.min(100, Number(params.limit || 10)));
  const skip = (page - 1) * limit;

  const sort = params.sort || 'createdAt';
  const order = params.order === 'desc' ? 'desc' : 'asc';

  return {
    skip,
    take: limit,
    orderBy: {
      [sort]: order,
    },
  };
};

export const getPaginationMeta = (
  page: string | number,
  limit: string | number,
  total: number
): PaginationMeta => {
  const pageNum = Math.max(1, Number(page || 1));
  const limitNum = Math.max(1, Math.min(100, Number(limit || 10)));
  const totalPages = Math.ceil(total / limitNum);

  return {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages,
  };
};
