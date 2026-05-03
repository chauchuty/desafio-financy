export type Category = {
  id: string;
  name: string;
};

export type GetCategoriesResponse = {
  categories: Category[];
};