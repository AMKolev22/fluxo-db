import { Router, Request, Response } from "express";
import { prisma } from "../index"; 

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const { amount, category, email, target } = req.body;
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        const targetUser = await prisma.user.findUnique({
            where: { email: target },
        });


        if (!user || !targetUser) {
            return res.status(404).send({ error: 'User not found' });
        }
        if (amount <= user.balance){
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
                typeOfTransaction: "SEND TO USER"
            },
        });

        const updatedSender = await prisma.user.update({
            where: { id: user.id },
            data: {
                balance: user.balance - amount,
            },
        });
        const updatedRecipient = await prisma.user.update({
            where: { id: targetUser.id },
            data: {
                balance: targetUser.balance + amount,
            },
        });

        return res.status(201).json({ transaction, updatedSender, updatedRecipient});
    }
    else{
        throw new Error("Insufficient funds");
    }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

export default router;