const OwnerModel = require('../models/OwnerModel');
const CondominiumModel = require('../models/CondominiumModel');

const condominiumController = {
    registerCondominium: async (req, res) => {

        const ownerId = req.user.id;
        const { name, address } = req.body;

        try {
            const condominium = await CondominiumModel.create(name, address);
            await OwnerModel.create(ownerId, condominium.id);

            res.status(201).json({ message: "Condomínio registrado com sucesso", condominium });
        } catch (error) {
            res.status(500).json({ message: "Erro ao registrar condomínio", error });
        }
    },
    getCondominiumsByOwner: async (req, res) => {
        const ownerId = req.user.id;
        try {
            const owner = await OwnerModel.getByUser(ownerId);
            if (!owner) {
                return res.status(404).json({ message: "Proprietário não encontrado" });
            }
            const condominiums = await OwnerModel.getByCondominium(owner.condominiumId);
            res.status(200).json({ condominiums });
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar condomínios", error });
        }
    }
};

module.exports = condominiumController;