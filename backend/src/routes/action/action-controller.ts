import { Router, Response, Request } from "express";
import { authJwtMiddleware } from "../auth/auth-middleware";
import { body, matchedData, validationResult } from "express-validator";
import prismaFromWishInstance from "../../database/prismaFromWish";
import { actionServices } from "./action-service";
import { notificationServices } from "../notification/notification-service";

const actionRouter = Router();

actionRouter.post(
  "/view",
  [
    body("originId").exists().isNumeric(),
    body("destinationId").exists().isNumeric(),
  ],
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }
    const data = matchedData(request);
    try {
      const responseString = await actionServices.viewProfile(
        data.originId,
        data.destinationId
      );
      await notificationServices.createSendNotification(
        data.originId,
        data.destinationId,
        "viewed"
      );
      return response.status(201).json(responseString);
    } catch (error: any) {
      return response.status(400).json(error.message);
    }
  }
);

actionRouter.put(
  "/like",
  [
    body("originId").exists().isNumeric(),
    body("destinationId").exists().isNumeric(),
  ],
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }
    const data = matchedData(request);
    try {
      const returnVal = await actionServices.updateProfile(
        data.originId,
        data.destinationId,
        "like"
      );
      await actionServices.updateRating(data.destinationId, 1);
      if (returnVal.newConnection) {
        await notificationServices.createSendNotification(
          data.originId,
          data.destinationId,
          "match"
        );
      } else {
        await notificationServices.createSendNotification(
          data.originId,
          data.destinationId,
          "like"
        );
      }
      return response.status(200).json(returnVal.message);
    } catch (error: any) {
      return response.status(400).json(error.message);
    }
  }
);

actionRouter.put(
  "/unlike",
  [
    body("originId").exists().isNumeric(),
    body("destinationId").exists().isNumeric(),
  ],
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }
    const data = matchedData(request);
    try {
      const responseString = await actionServices.updateProfile(
        data.originId,
        data.destinationId,
        "unlike"
      );
      await actionServices.updateRating(data.destinationId, -1);
      await notificationServices.createSendNotification(
        data.originId,
        data.destinationId,
        "unlike"
      );
      return response.status(200).json(responseString);
    } catch (error: any) {
      return response.status(400).json(error.message);
    }
  }
);

actionRouter.put(
  "/block",
  [
    body("originId").exists().isNumeric(),
    body("destinationId").exists().isNumeric(),
  ],
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }
    const data = matchedData(request);
    try {
      const responseString = await actionServices.updateProfile(
        data.originId,
        data.destinationId,
        "block"
      );
      return response.status(200).json(responseString);
    } catch (error: any) {
      return response.status(400).json(error.message);
    }
  }
);

actionRouter.put(
  "/unblock",
  [
    body("originId").exists().isNumeric(),
    body("destinationId").exists().isNumeric(),
  ],
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }
    const data = matchedData(request);
    try {
      const responseString = await actionServices.updateProfile(
        data.originId,
        data.destinationId,
        "unblock"
      );
      return response.status(200).json(responseString);
    } catch (error: any) {
      return response.status(400).json(error.message);
    }
  }
);

export default actionRouter;
