import { prisma } from "../lib/prisma";

export const CategoryService = {
  create(name: string, userId: string, description?: string, color?: string, icon?: string) {
    return prisma.category.create({
      data: {
        name,
        userId,
        description: description ?? "",
        color: color ?? "emerald",
        icon: icon ?? "tag",
      },
    });
  },

  async update(id: string, name: string, userId: string, description?: string, color?: string, icon?: string) {
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    return prisma.category.update({
      where: { id },
      data: {
        name,
        description: description ?? category.description,
        color: color ?? category.color,
        icon: icon ?? category.icon,
      },
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