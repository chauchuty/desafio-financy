import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { generateToken } from "../utils/auth";

export const resolvers = {
  Query: {
    me: (_: any, __: any, ctx: any) => {
      return prisma.user.findUnique({
        where: { id: ctx.userId },
      });
    },

    categories: (_: any, __: any, ctx: any) => {
      return prisma.category.findMany({
        where: { userId: ctx.userId },
      });
    },

    transactions: (_: any, __: any, ctx: any) => {
      return prisma.transaction.findMany({
        where: { userId: ctx.userId },
      });
    },
  },

  Mutation: {
    async register(_: any, args: any) {
      const hash = await bcrypt.hash(args.password, 10);

      const user = await prisma.user.create({
        data: { ...args, password: hash },
      });

      return {
        token: generateToken(user.id),
        user,
      };
    },

    async login(_: any, { email, password }: any) {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) throw new Error("Invalid password");

      return {
        token: generateToken(user.id),
        user,
      };
    },

    createCategory(_: any, { name }: any, ctx: any) {
      return prisma.category.create({
        data: {
          name,
          userId: ctx.userId,
        },
      });
    },

    updateCategory(_: any, { id, name }: any, ctx: any) {
      return prisma.category.update({
        where: { id },
        data: { name },
      });
    },

    deleteCategory(_: any, { id }: any) {
      return prisma.category.delete({ where: { id } }).then(() => true);
    },

    createTransaction(_: any, args: any, ctx: any) {
      return prisma.transaction.create({
        data: {
          ...args,
          userId: ctx.userId,
        },
      });
    },

    updateTransaction(_: any, { id, ...data }: any) {
      return prisma.transaction.update({
        where: { id },
        data,
      });
    },

    deleteTransaction(_: any, { id }: any) {
      return prisma.transaction.delete({ where: { id } }).then(() => true);
    },
  },
};