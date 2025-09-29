import { prisma } from "../lib/prisma";

const PersonModel = {
  async create(data: {
    name: string;
    phone: string;
    contact: string;
    cpf: string;
  }) {
    return await prisma.person.create({ data });
  },
  async delete(id: number) {
    return await prisma.person.delete({ where: { id } });
  },
};

export default PersonModel;
