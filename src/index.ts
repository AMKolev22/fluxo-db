import express, { Application, Request, Response } from 'express';

// Boot express
const app: Application = express();
const port = 8080;

// Application routing
app.use('/', (req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello from Ornio AS' });
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
