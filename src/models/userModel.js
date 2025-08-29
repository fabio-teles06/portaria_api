const { prismaClient, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const UserModel = {
    findByUserName: (username) => prisma.user.findUnique({ where: { username } }),
    findById: (id) => prisma.user.findUnique({ where: { id } }),
    create: (username, password) =>
        prisma.user.create({
            data: { username, password },
        }),
}

module.exports = UserModel;