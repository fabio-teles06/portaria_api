import { ROLE, Resident } from "@prisma/client";
import { prisma } from "../lib/prisma";

const ResidentModel = {
  async create(data: {
    condominiumId: number;
    apartmentId: number;
    name: string;
    cpf: string;
    userId: number;
  }) {
    return await prisma.resident.create({ data });
  },
  async findById(id: number, condominiumId: number) {
    return await prisma.resident.findUnique({ where: { id, condominiumId } });
  },
  async findByCpf(cpf: string, condominiumId: number) {
    return await prisma.resident.findUnique({ where: { cpf, condominiumId } });
  },
  async findAll(condominiumId: number): Promise<Resident[]> {
    return await prisma.resident.findMany({ where: { condominiumId } });
  },
  async delete(id: number, condominiumId: number) {
    return await prisma.resident.delete({ where: { id, condominiumId } });
  },
};

export default ResidentModel;
