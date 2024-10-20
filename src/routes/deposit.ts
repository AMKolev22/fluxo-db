import { Router, Request, Response } from "express";
import { prisma } from "../index"; 

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const { amount, category, email, target } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0'); 
        const currentTime = `${hours}:${minutes}`;
        const transaction = await prisma.transaction.create({
            data: {
                amount: amount,
                category: category,
                target: target,
                userId: user.id,
                timeProcessed: currentTime,
                typeOfTransaction: "DEPOSIT"
            },
        });

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                balance: user.balance + amount,
            },
        });

        return res.status(201).json({ transaction, updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

export default router;