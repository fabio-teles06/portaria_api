const { prismaClient, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const OwnerModel = {
    findById: async (id) => prisma.owner.findUnique({ where: { id } }),
    getByUser: async (userId) => prisma.owner.findUnique({ where: { userId } }),
    getByCondominium: async (condominiumId) => prisma.owner.findMany({ where: { condominiumId } }),
    create: async (userId, condominiumId) => {
        return prisma.owner.create({
            data: { userId, condominiumId },
        })
    }
}

module.exports = OwnerModel;