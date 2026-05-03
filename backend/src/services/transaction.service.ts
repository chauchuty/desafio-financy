import { prisma } from "../lib/prisma";

export const TransactionService = {
  async create(
    data: {
      title: string;
      amount: number;
      type: string;
      categoryId: string;
      date?: string;
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

    const transactionData: any = {
      title: data.title,
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      userId,
    };

    if (data.date) {
      transactionData.date = new Date(data.date);
    }

    return prisma.transaction.create({
      data: transactionData,
      include: {
        category: true,
      },
    });
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      amount: number;
      type: string;
      date?: string;
    }>,
    userId: string
  ) {
    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    
    const result = await prisma.transaction.updateMany({
      where: { id, userId },
      data: updateData,
    });

    if (result.count === 0) {
      throw new Error("Transação não encontrada");
    }

    return prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
      },
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
      include: {
        category: true,
       },
       orderBy: {
         date: "desc",
       },
     });
  },

  findById(id: string, userId: string) {
    return prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        category: true,
      },
    });
  },
};