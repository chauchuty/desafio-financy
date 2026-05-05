import { client } from "../apollo/client";
import { GET_CATEGORIES } from "../graphql/queries/categories";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "../graphql/mutations/category";

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface CreateCategoryPayload {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

interface UpdateCategoryPayload extends CreateCategoryPayload {
  id: string;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await client.query({
      query: GET_CATEGORIES,
    });
    return (data as any).categories;
  },

  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    const { data } = await client.mutate({
      mutation: CREATE_CATEGORY,
      variables: payload,
      refetchQueries: [{ query: GET_CATEGORIES }],
    });
    return (data as any).createCategory;
  },

  async updateCategory(payload: UpdateCategoryPayload): Promise<Category> {
    const { data } = await client.mutate({
      mutation: UPDATE_CATEGORY,
      variables: payload,
      refetchQueries: [{ query: GET_CATEGORIES }],
    });
    return (data as any).updateCategory;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const { data } = await client.mutate({
      mutation: DELETE_CATEGORY,
      variables: { id },
      refetchQueries: [{ query: GET_CATEGORIES }],
    });
    return (data as any).deleteCategory;
  },
};
