import { client } from "../apollo/client";
import { ME } from "../graphql/queries/me";
import { UPDATE_USER } from "../graphql/mutations/updateUser";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface UpdateUserPayload {
  name: string;
  email: string;
  password?: string;
}

export const userService = {
  async getMe(): Promise<User> {
    const { data } = await client.query({
      query: ME,
    });
    return (data as any).me;
  },

  async updateUser(payload: UpdateUserPayload): Promise<User> {
    const { data } = await client.mutate({
      mutation: UPDATE_USER,
      variables: payload,
      refetchQueries: [{ query: ME }],
    });
    return (data as any).updateUser;
  },
};
