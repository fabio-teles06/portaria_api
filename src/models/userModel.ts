import { ROLE, User } from "@prisma/client";
import { prisma } from "../lib/prisma";

const UserModel = {
  async create(data: {
    email: string;
    password: string;
    tenantId: number;
    role: ROLE;
    firstAccess: boolean;
    personId: number;
  }) {
    return await prisma.user.create({ data });
  },
  async findAll() {
    return await prisma.user.findMany();
  },
  async findById(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  },
  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  },
  async update(id: number, data: User) {
    return await prisma.user.update({ where: { id }, data });
  },
  async delete(id: number) {
    return await prisma.user.delete({ where: { id } });
  },
};

export default UserModel;
