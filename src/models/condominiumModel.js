const { prismaClient, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CondominiumModel = {
    findById: async (id) => prisma.owner.findUnique({ where: { id } }),
    create: async (
        name,
        address
    ) => {
        const condominium = await prisma.condominium.create({
            data: {
                name,
                address
            }
        });

        return condominium;
    }
}

module.exports = CondominiumModel;