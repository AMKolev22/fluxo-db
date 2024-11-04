import { Router, Request, Response } from "express";
import { prisma } from "../index"; 

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { budgetId, email } = req.body;
    console.log("pedal"); 
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (user){
            await prisma.budget.delete({
                    where: { id: budgetId, userId: user.id },
                });
            return res.status(200).json({message: "Transaction deleted"});
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

export default router;