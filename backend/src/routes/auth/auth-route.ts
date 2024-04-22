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
} from "./auth-utils";
import { authJwtMiddleware } from "./auth-middleware";
import { CustomUser } from "../../interfaces";
import { activeUsers, User } from "../../users/user";

const router = Router(); // Create a new router

// signup, signin, logout
router.post(
  "/auth/signup",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 8, max: 32 }),
    body("username").isLength({ min: 3, max: 16 }),
    body("lastname").isLength({ min: 3, max: 32 }),
    body("firstname").isLength({ min: 3, max: 32 }),
  ],
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const data = matchedData(request); // Sanitize the data
    const hashedPassword = await hashPassword(data.password);
    const user = await prismaFromWishInstance.create(
      "users",
      ["username", "email", "password", "firstname", "lastname"],
      [data.username, data.email, hashedPassword, data.firstname, data.lastname]
    );
    if (!user.data) {
      return response.status(400).json({ error: user.errorMessage });
    } else {
      const initialProfilePicture = Array.from({ length: 5 }, () => null);
      await prismaFromWishInstance.update(
        "users",
        ["profile_picture"],
        [initialProfilePicture],
        ["id"],
        [user.data.rows[0].id]
      );
      await generateToken(
        user.data.rows[0].id,
        data.email,
        data.username,
        response
      );
      delete user.data.rows[0].password;
      response.status(200).json({
        message:
          "User succesfully created, an email as been sent to you to verify your account",
        user: user.data.rows[0],
      });
    }
    await generateMailToken(user.data.rows[0].id, data.email);
  }
);

router.post(
  "/auth/signin",
  [
    body("username").isLength({ min: 3, max: 16 }),
    body("password").isLength({ min: 8, max: 32 }),
  ],
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const data = matchedData(request); // Sanitize the data

    const user = await prismaFromWishInstance.selectAll(
      "users",
      ["username"],
      [data.username]
    );

    if (
      !user.data ||
      user.data.rows.length == 0 ||
      !(await comparePassword(data.password, user.data!.rows[0].password))
    ) {
      return response.status(400).json({ error: "Invalid credentials" });
    } else {
      // if (!user.data.rows[0].verified) {
      // 	const token = await prismaFromWishInstance.selectAll(
      // 		"tokens",
      // 		["user_id"],
      // 		[user.data.rows[0].id]
      // 	);
      // 	const currentTimestamp = new Date().getTime();	// Get the current timestamp
      // 	if (!token.data || token.data.rows[0].expires_at.getTime() > currentTimestamp) {
      // 		if (token.data && token.data.rows[0].expires_at.getTime() > currentTimestamp)
      // 			await deleteToken(user.data.rows[0].id, token.data.rows[0].token);
      // 		await generateMailToken(user.data.rows[0].id, user.data.rows[0].email);
      // 	}
      // 	return response.status(400).json({ error: "User not verified" });
      // }

      await generateToken(
        user.data.rows[0].id,
        user.data.rows[0].email,
        user.data.rows[0].username,
        response
      );
      await prismaFromWishInstance.update(
        "users",
        ["connection_status"],
        [true],
        ["id"],
        [user.data.rows[0].id]
      );
      delete user.data.rows[0].password;
      response.status(200).json({
        message: "User succesfully signed in",
        user: user.data.rows[0],
      });
    }
  }
);

router.get(
  "/auth/logout",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    try {
      await prismaFromWishInstance.update(
        "users",
        ["connection_status"],
        [false],
        ["id"],
        [(request.user! as CustomUser).id]
      );
      response.clearCookie(process.env.JWT_ACCESS_TOKEN_COOKIE!, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
      response.status(200).json({ message: "User succesfully signed out" });
    } catch (error) {
      response.status(500).json({ error: "Logout: Internal Server Error" });
    }
  }
);

// Verify user
router.get(
  "/auth/:id/verify/:token",
  async (request: Request, response: Response) => {
    try {
      const user = await prismaFromWishInstance.selectAll(
        "users",
        ["id"],
        [request.params.id]
      );
      if (!user.data || user.data.rows.length == 0) {
        return response.status(400).json({ error: "Invalid link" });
      }
      const token = await prismaFromWishInstance.selectAll(
        "tokens",
        ["token", "user_id"],
        [request.params.token, request.params.id]
      );
      if (!token.data || token.data.rows.length == 0) {
        return response.status(400).json({ error: "Invalid link" });
      }
      // ici
      await prismaFromWishInstance.update(
        "users",
        ["verified"],
        [true],
        ["id"],
        [request.params.id]
      );

      await prismaFromWishInstance.delete(
        "tokens",
        ["token", "user_id"],
        [request.params.token, request.params.id]
      );
      response.json({ message: "User succesfully verified" });
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error 1" });
    }
  }
);

// Reset password
router.post(
  "/auth/forgotpassword",
  [body("email").isEmail()],
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const data = matchedData(request); // Sanitize the data
    const user = await prismaFromWishInstance.selectAll(
      "users",
      ["email"],
      [data.email]
    );
    if (!user.data || user.data.rows.length == 0) {
      return response
        .status(400)
        .json({ error: "User with given email does not exist!" });
    } else {
      await generatePasswordToken(user, data.email);
      response.json({
        message: "An email has been sent to you to reset your password",
      });
    }
  }
);

// verify passwordToken
router.get(
  "/auth/resetpassword/:id/:token",
  async (request: Request, response: Response) => {
    try {
      const user = await prismaFromWishInstance.selectAll(
        "users",
        ["id"],
        [request.params.id]
      );
      if (!user.data || user.data.rows.length == 0) {
        return response.status(400).json({ error: "Invalid link" });
      }
      const token = await prismaFromWishInstance.selectAll(
        "tokens",
        ["token", "user_id"],
        [request.params.token, request.params.id]
      );
      if (!token.data || token.data.rows.length == 0) {
        return response.status(400).json({ error: "Invalid link" });
      }
      response.status(200).json({ message: "Valid Url" });
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Reset password
router.post(
  "/auth/resetpassword/:id/:token",
  [body("password").isLength({ min: 8, max: 32 })],
  async (request: Request, response: Response) => {
    try {
      const user = await prismaFromWishInstance.selectAll(
        "users",
        ["id"],
        [request.params.id]
      );
      if (!user.data || user.data.rows.length == 0) {
        return response.status(400).json({ error: "Invalid link" });
      }
      const token = await prismaFromWishInstance.selectAll(
        "tokens",
        ["token", "user_id"],
        [request.params.token, request.params.id]
      );
      if (!token.data || token.data.rows.length == 0) {
        return response.status(400).json({ error: "Invalid link" });
      }
      if (!user.data.rows[0].verified) {
        await prismaFromWishInstance.update(
          "users",
          ["verified"],
          [true],
          ["id"],
          [request.params.id]
        );
      }
      const hashedPassword = await hashPassword(request.body.password);
      await prismaFromWishInstance.update(
        "users",
        ["password"],
        [hashedPassword],
        ["id"],
        [request.params.id]
      );
      await deleteToken(request.params.token, user.data.rows[0].id);
      response.status(200).json({ message: "Password succesfully reset" });
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router; // Export the router
