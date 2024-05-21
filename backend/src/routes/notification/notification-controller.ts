import { Router, Response, Request } from "express";
import { authJwtMiddleware } from "../auth/auth-middleware";
import { body, matchedData, validationResult } from "express-validator";
import { notificationServices } from "./notification-service";

const notificationRouter = Router();

notificationRouter.get(
  "/",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }
    return response
      .status(200)
      .json(await notificationServices.getNotifications(request));
  }
);

notificationRouter.get(
  "/unreadNotifications",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    return response
      .status(200)
      .json(await notificationServices.getUnreadCount(request));
  }
);

notificationRouter.put(
  "/read",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }
    return response
      .status(204)
      .json(await notificationServices.readNotifications(request));
  }
);

notificationRouter.post(
  "/create",
  authJwtMiddleware,
  [
    body("userId").isNumeric(),
    body("username").exists().isString(),
    body("type")
      .exists()
      .isString()
      .isIn(["Like", "Unlike", "View", "Block", "Report"])
      .withMessage("Invalid notification type"),
  ],
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const data = matchedData(request);
    return response
      .status(201)
      .json(
        await notificationServices.createSendNotification(
          data.userId,
          data.username,
          data.type
        )
      );
  }
);

notificationRouter.delete(
  "/all",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }
    return response
      .status(204)
      .json(await notificationServices.deleteAllNotifications(request));
  }
);

notificationRouter.delete(
  "/one",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }
    return response
      .status(204)
      .json(await notificationServices.deleteOneNotification(request));
  }
);

export default notificationRouter;
