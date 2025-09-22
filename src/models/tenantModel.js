const { prisma } = require("../lib/prisma");

const TenantModel = {
  async create(data) {
    return await prisma.tenant.create({ data });
  },
  async findAll() {
    return await prisma.tenant.findMany();
  },
  async findById(id) {
    return await prisma.tenant.findUnique({ where: { id } });
  },
  async update(id, data) {
    return await prisma.tenant.update({ where: { id }, data });
  },
  async delete(id) {
    return await prisma.tenant.delete({ where: { id } });
  },
};

module.exports = TenantModel;
