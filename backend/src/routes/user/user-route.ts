import { Router, Response, Request } from "express";
import { body, validationResult, matchedData } from "express-validator";
import prismaFromWishInstance from "../../database/prismaFromWish";
import passport from "passport";
import {
  generateToken,
  generateMailToken,
  deleteToken,
  generatePasswordToken,
  hashPassword,
  comparePassword,
} from "../auth/auth-utils";
import { authJwtMiddleware } from "../auth/auth-middleware";

const router = Router(); // Create a new router

interface CustomUser {
  id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  password?: string;
  verify: boolean;
  connection_status: boolean;
  created_at: Date;
  updated_at: Date;
}

router.get(
  "/users/me",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const user = request.user as CustomUser;
    delete user.password;
    response.status(200).json(user);
  }
);

router.post(
  "/users/connect",
  [body("originId").isNumeric(), body("destinationId").isNumeric()],
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const data = matchedData(request);
    prismaFromWishInstance.create(
      "connection",
      ["origin_user_id", "destination_user_id"],
      [
        Math.min(data.originId, data.destinationId),
        Math.max(data.originId, data.destinationId),
      ]
    );
    return response.status(201).json({
      message: "connection created",
      origin: Math.min(data.originId, data.destinationId),
      destination: Math.max(data.originId, data.destinationId),
    });
  }
);

export default router;
