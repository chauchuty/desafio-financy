import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const UserService = {
  async create(name: string, email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    return user;
  },

  async update(id: string, name: string, email: string, password?: string) {
    const data: any = { name, email };

    if (password && password.trim()) {
      data.password = await bcrypt.hash(password, 10);
    }

    return prisma.user.update({
      where: { id },
      data,
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },
};