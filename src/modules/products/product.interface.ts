export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
