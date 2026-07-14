export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  categoryId: string;
  images?: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  images?: string[];
}
