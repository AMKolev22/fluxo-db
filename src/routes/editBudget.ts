import { Router, Request, Response } from "express";
import { prisma } from "../index"; 

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { budgetId, email, category, goal, deadline } = req.body;
    console.log("pedal");
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (user){
            const updatedBudget = await prisma.budget.update({
                    where: { id: budgetId, userId: user.id },
                    data: {
                        goal: goal,
                        category: category,
                        deadline: deadline,
                    },
                });
            return res.status(200).json(updatedBudget);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

export default router;