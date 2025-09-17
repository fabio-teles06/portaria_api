const { prismaClient, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const OwnerModel = {
  findByUser: async (userId) => {
    return await prisma.owner.findMany({
      where: { userId },
      select: {
        id: false,
        userId: false,
        condominium: true
      },
    });
  },
  isOwner: async (userId, condominiumId) => {
    return prisma.owner.count({
      where: {
        userId,
        condominiumId
      }
    }) > 0;
  }
};

module.exports = OwnerModel;
