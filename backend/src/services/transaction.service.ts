import { prisma } from "../lib/prisma";

export const TransactionService = {
  async create(
    data: {
      title: string;
      amount: number;
      type: string;
      categoryId: string;
    },
    userId: string
  ) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId,
      },
    });

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    return prisma.transaction.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      amount: number;
      type: string;
    }>,
    userId: string
  ) {
    const result = await prisma.transaction.updateMany({
      where: { id, userId },
      data,
    });

    if (result.count === 0) {
      throw new Error("Transação não encontrada");
    }

    return prisma.transaction.findUnique({
      where: { id },
    });
  },

  async delete(id: string, userId: string) {
    const result = await prisma.transaction.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new Error("Transação não encontrada");
    }

    return true;
  },

  findAll(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
    });
  },

  findById(id: string, userId: string) {
    return prisma.transaction.findFirst({
      where: { id, userId },
    });
  },
};