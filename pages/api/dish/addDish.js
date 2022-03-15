import { PrismaClient } from "@prisma/client";
import prisma from "../../../lib/prisma.ts";


export default async (req, res) => {
  const data = req.body;
  try {
    const user = await prisma.dish.create({
      data: {
        ...data,
      },
    });
    res.status(200).json({ dish });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while adding a new dish." });
  }
};