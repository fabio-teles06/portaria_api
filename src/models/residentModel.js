const { prismaClient, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ResidentModel = {
  findByUser: async (userId) => {
    return await prisma.resident.findMany({
      where: { userId },
      select: {
        id: false,
        userId: false,
        propertyId: false,
        property: true,
      },
    });
  },
};

module.exports = ResidentModel;
