import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { generateToken } from "../utils/auth";
import { CategoryService } from "../services/category.service";
import { TransactionService } from "../services/transaction.service";
import { UserService } from "../services/user.service";
import { requireAuth } from "../utils/requireAuth";

export const resolvers = {
  Query: {
    me: async (_: any, __: any, ctx: any) => {
      const userId = requireAuth(ctx);
      return UserService.findById(userId);
    },

    categories: async (_: any, __: any, ctx: any) => {
      const userId = requireAuth(ctx);
      return CategoryService.findAll(userId);
    },

    transactions: async (_: any, __: any, ctx: any) => {
      const userId = requireAuth(ctx);
      return TransactionService.findAll(userId);
    },
  },

  Mutation: {
    async register(_: any, args: any) {
      const hash = await bcrypt.hash(args.password, 10);

      const user = await UserService.create(
        args.name,
        args.email,
        hash
      );

      return {
        token: generateToken(user.id),
        user,
      };
    },

    async login(_: any, { email, password }: any) {
      const user = await UserService.findByEmail(email);

      if (!user) throw new Error("Usuário não encontrado");

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) throw new Error("Credenciais inválidas");

      return {
        token: generateToken(user.id),
        user,
      };
    },

    createCategory(_: any, { name }: any, ctx: any) {
      const userId = requireAuth(ctx);
      return CategoryService.create(name, userId);
    },

    updateCategory(_: any, { id, name }: any, ctx: any) {
      const userId = requireAuth(ctx);
      return CategoryService.update(id, name, userId);
    },

    deleteCategory(_: any, { id }: any, ctx: any) {
      const userId = requireAuth(ctx);
      return CategoryService.delete(id, userId);
    },

    createTransaction(_: any, args: any, ctx: any) {
      const userId = requireAuth(ctx);
      return TransactionService.create(args, userId);
    },

    updateTransaction(_: any, { id, ...data }: any, ctx: any) {
      const userId = requireAuth(ctx);
      return TransactionService.update(id, data, userId);
    },

    deleteTransaction(_: any, { id }: any, ctx: any) {
      const userId = requireAuth(ctx);
      return TransactionService.delete(id, userId);
    },
  },
};