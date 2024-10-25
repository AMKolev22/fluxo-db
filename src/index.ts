import express, { Application, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from "./routes/auth"; 
import deposit from "./routes/deposit";
import withdraw from "./routes/withdraw";
import send from "./routes/send";
import edit from "./routes/editTransaction";
import token from "./routes/session";
import deleteTransaction from "./routes/deleteTransaction";
import getTokenInfo from "./routes/getSessionInfo";
import deleteToken from "./routes/deleteSession";
import cors from "cors";

const app: Application = express();
const port = 8000;

app.use(express.json());
app.use(cors());
export const prisma = new PrismaClient();

app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ data: 'ROOT' });
});

app.use('/api/auth', auth); 
app.use('/api/deposit', deposit);
app.use('/api/withdraw', withdraw);
app.use('/api/send', send);
app.use('/api/editTransaction', edit);
app.use('/api/deleteTransaction', deleteTransaction);
app.use('/api/session', token);
app.use("/api/getInfo", getTokenInfo);
app.use("/api/deleteSession", deleteToken);

app.listen(port, () => console.log(`Server is listening on port ${port}!`));