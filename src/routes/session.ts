import { Router, Request, Response } from "express";
import { prisma } from "../index"; 

const router = Router();

router.post("/", async (req: Request, res: Response) => {

    const { email } = req.body;
    const mid = Math.floor(email.length / 2); 
    const leftPart = email.slice(0, mid);    
    const rightPart = email.slice(mid);
    
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(404).send({ error: 'User not found' });
    }

    const sessionID = leftPart + user.id + rightPart;
    const session = await prisma.conclave.findUnique({
        where: { id: sessionID },
    });

    const sessionData = {
        id: sessionID,
        active: true,
    }

    if (session)
        return res.status(200).send({ message: 'Session already exists', session, userId: user.id });

    else if (!session){

        await prisma.conclave.create({
            data: sessionData,
        });
    }
    return res.status(201).send({ message: 'Session created successfully', sessionData, userId: user.id });
});

export default router;