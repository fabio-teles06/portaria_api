const { prismaClient, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CondominiumModel = {
  getById: async (id) => {
    return await prisma.condominium.findUnique({
      where: { id },
    });
  },
  create : async (data) => {
    return await prisma.condominium.create({
      data
    });
  }
};

module.exports = CondominiumModel;
