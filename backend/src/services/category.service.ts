import { prisma } from "../lib/prisma";

export const CategoryService = {
  create(name: string, userId: string) {
    return prisma.category.create({
      data: { name, userId },
    });
  },

  async update(id: string, name: string, userId: string) {
    const result = await prisma.category.updateMany({
      where: { id, userId },
      data: { name },
    });

    if (result.count === 0) {
      throw new Error("Categoria não encontrada");
    }

    return prisma.category.findUnique({
      where: { id },
    });
  },

  async delete(id: string, userId: string) {
    const result = await prisma.category.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new Error("Categoria não encontrada");
    }

    return true;
  },

  findAll(userId: string) {
    return prisma.category.findMany({
      where: { userId },
    });
  },

  findById(id: string, userId: string) {
    return prisma.category.findFirst({
      where: { id, userId },
    });
  },
};