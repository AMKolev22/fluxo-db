import { Router, Request, Response } from "express";
import { prisma } from "../index"; 

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { password, email } = req.body;
    console.log("pedal"); 
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            const createUser = await prisma.user.create({
                data: {
                    email: email,
                    password: password,
                    balance: 0,
                },
            });
            return res.status(201).send({ message: "User created successfully.", user: createUser });
        } else if (user.password !== password) {
            return res.status(401).send({ message: 'Invalid password' });
        }

        return res.status(200).send({ message: 'User authenticated', user });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
});

export default router;
