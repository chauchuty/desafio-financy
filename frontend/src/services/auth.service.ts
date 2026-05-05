import { client } from "../apollo/client";
import { LOGIN } from "../graphql/mutations/login";
import { REGISTER } from "../graphql/mutations/register";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await client.mutate({
      mutation: LOGIN,
      variables: credentials,
    });
    return (data as any).login;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await client.mutate({
      mutation: REGISTER,
      variables: credentials,
    });
    return (data as any).register;
  },

  logout(): void {
    localStorage.removeItem("token");
    client.clearStore();
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  setToken(token: string): void {
    localStorage.setItem("token", token);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
