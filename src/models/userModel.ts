import { ROLE, User } from "@prisma/client";
import { prisma } from "../lib/prisma";

const UserModel = {
  async create(data: {
    email: string;
    password: string;
    role: ROLE | undefined;
    personId: number;
    condominiumId: number;
  }) {
    return await prisma.user.create({ data });
  },
  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  },
  async findById(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  },
  async updatePassword(id: number, newPassword: string) {
    return await prisma.user.update({
      where: { id },
      data: { password: newPassword, firstAccess: false },
    });
  },
  async delete(id: number) {
    return await prisma.user.delete({ where: { id } });
  },
};

export default UserModel;
