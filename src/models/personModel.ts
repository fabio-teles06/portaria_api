import { Person } from "@prisma/client";
import { prisma } from "../lib/prisma";

const PersonModel = {
  async create(data: { name: string; cpf: string; phone: string }) {
    return await prisma.person.create({ data });
  },
  async findByCpf(cpf: string) {
    return await prisma.person.findUnique({ where: { cpf } });
  },
  async findById(id: number) {
    return await prisma.person.findUnique({ where: { id } });
  },
  async findAll() {
    return await prisma.person.findMany();
  },
};

export default PersonModel;
