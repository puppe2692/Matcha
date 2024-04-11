import { Router, Response, Request } from "express";
import { authJwtMiddleware } from "../auth/auth-middleware";
import { matchedData, validationResult } from "express-validator";
import prismaFromWishInstance from "../../database/prismaFromWish";
import { chatServices } from "./chat-service";

const chatRouter = Router();

chatRouter.get(
  "/contacts",
  //   authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const userId = parseInt(request.query.id as string);
    const connections = await prismaFromWishInstance.customQuery(
      `SELECT
		connection.id,
		origin_user_id,
		destination_user_id,
		date,
		u1.username AS origin_user_username,
		u2.username AS destination_user_username
	FROM
		connection
	JOIN
		users u1 ON connection.origin_user_id = u1.id
	JOIN
		users u2 ON connection.destination_user_id = u2.id
	WHERE
		connection.origin_user_id = $1 OR connection.destination_user_id = $1;`,
      [userId]
    );
    if (!connections.data?.rows) {
      return response.status(200).json([]);
    } else {
      return response.status(200).json(await chatServices.getContacts(request));
    }
  }
);

chatRouter.get(
  "/messages",
  //   authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    return response.status(200).json(await chatServices.getMessages(request));
  }
);

export default chatRouter;
