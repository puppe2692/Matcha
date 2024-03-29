import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/api", (req: Request, res: Response) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
