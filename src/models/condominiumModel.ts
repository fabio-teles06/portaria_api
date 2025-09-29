import { prisma } from "../lib/prisma";

const CondominiumModel = {
  create: async (data: {
    name: string;
    address: string;
    cnpj: string;
    contact: string;
    email: string;
    phone: string;
  }) => {
    return await prisma.condominium.create({
      data,
    });
  },
};

export default CondominiumModel;
