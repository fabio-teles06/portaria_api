import { prisma } from "../lib/prisma";

const ResidentModel = {
  async create(data: {
    personId: number;
    apartment: string;
    block: string;
    tenantId: number;
  }) {
    return prisma.resident.create({
      data: {
        personId: data.personId,
        apartment: data.apartment,
        block: data.block,
        tenantId: data.tenantId,
      },
    });
  },
};

export default ResidentModel;
