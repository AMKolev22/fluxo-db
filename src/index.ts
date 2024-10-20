import express, { Application, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from "./routes/auth"; 
import deposit from "./routes/deposit";
import withdraw from "./routes/withdraw";

const app: Application = express();
const port = 3000;

app.use(express.json());

export const prisma = new PrismaClient();

app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ data: 'ROOT' });
});

app.use('/auth', auth); 
app.use('/deposit', deposit);
app.use('/withdraw', withdraw);
app.listen(port, () => console.log(`Server is listening on port ${port}!`));