const { prisma } = require("../lib/prisma");

const UserModel = {
  async create(data) {
    return await prisma.user.create({ data });
  },
  async findAll() {
    return await prisma.user.findMany();
  },
  async findById(id) {
    return await prisma.user.findUnique({ where: { id } });
  },
  async update(id, data) {
    return await prisma.user.update({ where: { id }, data });
  },
  async delete(id) {
    return await prisma.user.delete({ where: { id } });
  },
};

module.exports = UserModel;
