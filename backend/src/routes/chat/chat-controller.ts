import { Router, Response, Request } from "express";
import { authJwtMiddleware } from "../auth/auth-middleware";
import { body, matchedData, validationResult } from "express-validator";
import prismaFromWishInstance from "../../database/prismaFromWish";
import { chatServices } from "./chat-service";

const chatRouter = Router();

chatRouter.get(
  "/contacts",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      console.log("here");
      return response.status(400).json({ errors: errors.array() });
    }

    return response.status(200).json(await chatServices.getContacts(request));
  }
);

chatRouter.get(
  "/messages",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    return response.status(200).json(await chatServices.getMessages(request));
  }
);

chatRouter.get(
  "/unreadMessages",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    return response
      .status(200)
      .json(await chatServices.getUnreadCount(request));
  }
);

chatRouter.put(
  "/readMessages",
  [body("senderId").isNumeric(), body("receiverId").isNumeric()],
  (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const data = matchedData(request);
    return response
      .status(200)
      .json(chatServices.readMessages(data.senderId, data.receiverId));
  }
);

export default chatRouter;
