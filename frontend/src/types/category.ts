export type Category = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
};

export type GetCategoriesResponse = {
  categories: Category[];
};