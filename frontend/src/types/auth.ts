import type { User } from "./user";

export type LoginResponse = {
  login: {
    token: string;
    user: User;
  };
};

export type RegisterResponse = {
  register: {
    token: string;
    user: User;
  };
};