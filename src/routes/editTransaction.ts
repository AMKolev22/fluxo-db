import { Router, Request, Response } from "express";
import { prisma } from "../index"; 

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { transactionId, email, category, amount, target } = req.body;
    console.log("pedal"); 
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (user){
            const updatedTransaction = await prisma.transaction.update({
                    where: { id: transactionId, userId: user.id },
                    data: {
                        amount: amount,
                        category: category,
                        target: target,
                    },
                });
            return res.status(200).json(updatedTransaction);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

export default router;