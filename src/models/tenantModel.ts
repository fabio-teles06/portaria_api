import { Tenant } from "@prisma/client";
import { prisma } from "../lib/prisma";

const TenantModel = {
  async create(data: {
    name: string;
    address: string;
  }) {
    return await prisma.tenant.create({ data });
  },
  async findAll() {
    return await prisma.tenant.findMany();
  },
  async findById(id: number) {
    return await prisma.tenant.findUnique({ where: { id } });
  },
  async update(id: number, data: Partial<Tenant>) {
    return await prisma.tenant.update({ where: { id }, data });
  },
  async delete(id: number) {
    return await prisma.tenant.delete({ where: { id } });
  },
};

export default TenantModel;
