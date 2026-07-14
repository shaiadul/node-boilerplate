import { slugify } from '../categories/category.utils';

export const generateProductSlug = (name: string): string => {
  return slugify(name);
};
