const { prismaClient, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const UserModel = {
    findByUserName: async (username) => prisma.user.findUnique({ where: { username } }),
    findByEmail: async (email) => prisma.user.findUnique({ where: { email } }),
    findById: async (id) => prisma.user.findUnique({ where: { id } }),
    create: async (username, email, password) =>
        prisma.user.create({
            data: { username, email, password },
        }),
}

module.exports = UserModel;