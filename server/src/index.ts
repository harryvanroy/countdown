import express, { Request, Response } from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { Logger } from "tslog";
import { userJoin, getRoomUsers, getCurrentUser, userLeave } from "./users";
import "dotenv/config";
import { populateSet } from "./util/letters"
import { generateNumbersSolutions } from "./util/numbers"

const log: Logger = new Logger();

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);

app.use(cors());
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up and running!");
});

app.get("/wordsolutionrequest/:chars", (req: Request, res: Response) => {

  if (req.params.chars.length > 9) {
    res.status(400).send("Fuck you bastard");
  }
  const perms = populateSet(req.params.chars)
  res.send(perms);
});

app.get("/numbersolutionrequest/:nums/:target", (req: Request, res: Response) => {

  // const bod = res.json({ requestBody: req.body })
  if (req.params.nums == undefined || req.params.target == undefined) {
    res.status(400).send("Fuck you bastard");
  }
  const nums = req.params.nums.split(",").map(a => parseInt(a));
  const target = parseInt(req.params.target);
  const solutions = generateNumbersSolutions(nums, target)

  res.send(solutions);
});


app.listen(port, () => {
  log.info(`Server started at http://localhost:${port}`);
});


