import express, { Request, Response } from "express";
import { Logger } from "tslog";
import "dotenv/config";

const log: Logger = new Logger();

const app = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello!");
});

app.listen(port, () => {
  log.info(`server started at http://localhost:${port}`);
});
