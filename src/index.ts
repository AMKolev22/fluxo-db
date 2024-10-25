import express, { Application, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

import auth from "./routes/auth";
import deposit from "./routes/deposit";
import withdraw from "./routes/withdraw";
import send from "./routes/send";
import edit from "./routes/editTransaction";
import token from "./routes/session";
import deleteTransaction from "./routes/deleteTransaction";
import getTokenInfo from "./routes/getSessionInfo";
import deleteToken from "./routes/deleteSession";

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// Prisma client with detailed logging
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

app.use((req: Request, res: Response, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ data: 'ROOT' });
});

app.use('/auth', auth);
app.use('/deposit', deposit);
app.use('/withdraw', withdraw);
app.use('/send', send);
app.use('/editTransaction', edit);
app.use('/deleteTransaction', deleteTransaction);
app.use('/session', token);
app.use("/getInfo", getTokenInfo);
app.use("/deleteSession", deleteToken);

app.listen(port, () => console.log(`Server is listening on port ${port}!`));
