const { prismaClient, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const UserModel = {
    findByUserName: (username) => prisma.user.findUnique({ where: { username } }),
    findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
    findById: (id) => prisma.user.findUnique({ where: { id } }),
    create: (username, email, password) =>
        prisma.user.create({
            data: { username, email, password },
        }),
}

module.exports = UserModel;