import { Person } from "@prisma/client";
import { prisma } from "../lib/prisma";

const PersonModel = {
  async create(data: {
    name: string;
    cpf: string;
    phone: string;
    tenantId: number;
  }) {
    return await prisma.person.create({ data });
  },
  async findById(id: number) {
    return await prisma.person.findUnique({ where: { id } });
  },
};

export default PersonModel;
