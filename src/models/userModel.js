const { prismaClient, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const UserModel = {
  findByEmail: async (email) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },
  create: async (data) => {
    return await prisma.user.create({
      data,
    });
  },
};

module.exports = UserModel;
