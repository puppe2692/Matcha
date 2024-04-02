import express, { Express, Request, Response } from "express";
import authRouters from "./src/routes/auth-route";

const app: Express = express();

app.use(express.json());  // Middleware to parse JSON
app.use(authRouters); // Use the authRouters

app.get("/api", (req: Request, res: Response) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
