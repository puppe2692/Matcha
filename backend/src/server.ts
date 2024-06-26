import express, { Express, Request, Response } from "express";
import pool from "./database/db_pool";
import cors from "cors";
import dbInstance from "./database/database";
import prismaFromWishInstance from "./database/prismaFromWish";
import { WebSocket } from "./gateway/webSocket";
import authRouters from "./routes/auth/auth-route";
import userRouters from "./routes/user/user-route";
import chatRouter from "./routes/chat/chat-controller";
import actionRouter from "./routes/action/action-controller";
import notificationRouter from "./routes/notification/notification-controller";

const app: Express = express();
app.use(express.json());
const corsOptions = {
  origin: `http://${process.env.REACT_APP_SERVER_ADDRESS}:3000`,
  credentials: true, // Autoriser les informations d'identification dans les requêtes
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Ajoute les méthodes HTTP nécessaires
  allowedHeaders: ["Content-Type", "Authorization"], // Ajoute les en-têtes CORS nécessaires
};
app.use(cors(corsOptions));

app.use(authRouters);
app.use(userRouters);
app.use("/chat", chatRouter);
app.use("/notification", notificationRouter);
app.use("/action", actionRouter);

const appserver = app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

dbInstance.initDatabase();

export const webSocket = new WebSocket(appserver);

//routes examples for testing database manipulation messages

app.get("/api", (req: Request, res: Response) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.get("/api/get_all_users", async (req: Request, res: Response) => {
  const data = await prismaFromWishInstance.selectAll("users");
  if (data.data) {
    res.status(200).send(data.data.rows);
  } else {
    res.status(404).send({ error: data.errorMessage });
  }
});

app.post("/api", async (req: Request, res: Response) => {
  const { username, email } = req.body;
  const data = await prismaFromWishInstance.create(
    "users",
    ["username", "email"],
    [username, email]
  );
  if (data.data) {
    res
      .status(200)
      .send({ message: "Successfully added entry", data: data.data });
  } else {
    res.status(404).send({ error: data.errorMessage });
  }
});

// app.delete("/api", async (req: Request, res: Response) => {
//   const { id } = req.body;
//   const data = await prismaFromWishInstance.delete("users", ["id"], [id]);
//   if (data.data) {
//     res
//       .status(200)
//       .send({ message: "Successfully deleted entry", data: data.data });
//   } else {
//     res.status(404).send({ error: data.errorMessage });
//   }
// });

// app.put("/api", async (req: Request, res: Response) => {
//   const { id, username } = req.body;
//   const data = await prismaFromWishInstance.update(
//     "users",
//     ["username"],
//     [username],
//     ["id"],
//     [id]
//   );
//   if (data.data) {
//     res
//       .status(200)
//       .send({ message: "Successfully modified entry", data: data.data });
//   } else {
//     res.status(404).send({ error: data.errorMessage });
//   }
// });
