import { Router, Request, Response } from "express";
import { prisma } from "../index"; 

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const { amount, category, email, target, type } = req.body;
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

        const amountFloat = parseFloat(amount);
        
        if (type == "WITHDRAW"){

            if (amount <= user.balance){
                    
                const transaction = await prisma.transaction.create({
                    data: {
                        amount: amountFloat,
                        category: category,
                        target: target,
                        userId: user.id,
                        timeProcessed: currentTime,
                        typeOfTransaction: "WITHDRAW"
                    },
                });

                const updatedUser = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        balance: user.balance - amountFloat,
                    },
                });

                return res.status(201).json({ transaction, updatedUser });
            }
            else{
                throw new Error("Insufficient funds");
            }

        } else{
            const budgetId = type.split(":")[2];
            const budget = await prisma.budget.findUnique({
                where: {id: Number(budgetId)},
            });

            if (budget == null){throw new Error("Budget is null");}

            if (budget.amountInserted >= amountFloat){

                const transaction = await prisma.transaction.create({
                    data: {
                        amount: amountFloat,
                        category: category,
                        target: budget.title,
                        userId: user.id,
                        timeProcessed: currentTime,
                        typeOfTransaction: type,
                    },
                });

                const updatedUser = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        balance: user.balance + amountFloat,
                    },
                });

                const updatedBudget = await prisma.budget.update({
                    where: {id: Number(budget.id)},
                    data:{
                        amountInserted: budget.amountInserted - amountFloat,
                    },
                });

                return res.status(201).json({ transaction, updatedUser, updatedBudget });

            } else{
                throw new Error("Insufficient funds");
            }
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

export default router;