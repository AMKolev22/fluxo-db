import { Router, Request, Response } from "express";
import { prisma } from "../index"; 

const router = Router();

router.post("/", async (req: Request, res: Response) => {

    const { token } = req.body;
    const session = await prisma.conclave.findUnique({
        where: { id: token },
    });

    if (!session)
        return res.status(404).send({ error: 'Session not found' });

    else {

        await prisma.conclave.delete({
            where: { id: token },
            });

    return res.status(200).send({ message: 'Session deleted' });
    
    }
});


export default router;