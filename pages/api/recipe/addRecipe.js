import prisma from "../../../lib/prisma.ts";

export default async (req, res) => {
  const data = req.body;
  try {
    const recipe = await prisma.recipe.create({
      data: {
        ...data,
      },
    });
    res.status(200).json(recipe);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while adding a new recipe." });
  }
};
