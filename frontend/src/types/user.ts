export type User = {
  id: string;
  name: string;
  email: string;
};

export type MeResponse = {
  me: User;
};