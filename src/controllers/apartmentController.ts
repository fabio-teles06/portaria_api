import { Request, Response } from "express";
import prisma from "../lib/prisma";

async function createApartment(req: Request, res: Response) {
  const {
    number,
    residentName,
    condominiumId,
  }: {
    number: string;
    residentName: string;
    condominiumId: number;
  } = req.body;

  try {
    const apartment = await prisma.apartment.create({
      data: {
        number,
        residentName,
        condominiumId,
      },
    });
    res.status(201).json(apartment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create apartment" });
  }
}

async function getApartments(req: Request, res: Response) {
  try {
    const apartments = await prisma.apartment.findMany();
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch apartments" });
  }
}

async function getApartmentsByCondominium(req: Request, res: Response) {
  const condominiumId = parseInt(req.params.condominiumId, 10);
  try {
    const apartments = await prisma.apartment.findMany({
      where: { condominiumId },
    });
    res.status(200).json(apartments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch apartments for the condominium" });
  }
}

async function addResidentToApartment(req: Request, res: Response) {
  const apartmentId = parseInt(req.params.apartmentId, 10);
  const { userId }: { userId: number } = req.body;

  try {
    prisma.resident.create({
      data: {
        apartmentId,
        userId,
      },
    });
    res
      .status(201)
      .json({ message: "Resident added to apartment successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add resident to apartment" });
  }
}

async function getResidentsByApartment(req: Request, res: Response) {
  const apartmentId = parseInt(req.params.apartmentId, 10);
  try {
    const residents = await prisma.resident.findMany({
      where: { apartmentId },
    });
    res.status(200).json(residents);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch residents for the apartment" });
  }
}

async function removeResidentFromApartment(req: Request, res: Response) {
  const apartmentId = parseInt(req.params.apartmentId, 10);
  const userId = parseInt(req.params.userId, 10);
  try {
    await prisma.resident.deleteMany({
      where: { apartmentId, userId },
    });
    res
      .status(200)
      .json({ message: "Resident removed from apartment successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove resident from apartment" });
  }
}

export {
  createApartment,
  getApartments,
  getApartmentsByCondominium,
  getResidentsByApartment,
};
