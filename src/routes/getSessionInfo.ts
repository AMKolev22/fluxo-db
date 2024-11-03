import { Router, Request, Response } from "express";
import { prisma } from "../index"; 

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try{

        const { token, id } = req.body;
        const mid = Math.floor((token.length - id.length) / 2);

        const leftPart = token.slice(0, mid);
        const rightPart = token.slice(mid + id.length);

        const user = await prisma.user.findUnique({
            where: { email: leftPart + rightPart },
        });

        if (!user){
            return res.status(404).send({ error: 'User not found' });
        }
        
        else if (user){
            const transactions = await prisma.transaction.findMany({
                where: { 
                    OR: [
                        { userId: user.id },
                        { target: user.email},
                    ]
                }
            });

        const budgets = await prisma.budget.findMany({
                where: { userId: user.id },
            });
            
            const data = {
                email: user.email,
                balance: user.balance,
                id: user.id,
                transactions: transactions,
                budgets: budgets,
            }
            return res.status(200).send(JSON.stringify(data));
        }
            

    } catch (error) {
        return res.status(500).send({ error: error });
    }
});

export default router;
