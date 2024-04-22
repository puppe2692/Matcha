import { Router, Response, Request } from "express";
import { body, validationResult, matchedData } from "express-validator";
import prismaFromWishInstance from "../../database/prismaFromWish";
import { CustomUser } from "../../interfaces";
import { upload } from "./user-middleware";
import { authJwtMiddleware } from "../auth/auth-middleware";
import { PrismaReturn } from "../../data_structures/data";

const router = Router(); // Create a new router

router.get(
  "/users/me",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const user = request.user as CustomUser;
    delete user.password;
    console.log(user);
    response.status(200).json(user);
  }
);

router.get(
  "/users/all_interesting",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const user = request.user as CustomUser;
    let relevantUsers: PrismaReturn;
    if (user.sexual_preference === "Man") {
      relevantUsers = await prismaFromWishInstance.customQuery(
        `select users.*
      FROM users 
      LEFT JOIN status 
        on users.id = status.destination_user_id 
        AND status.origin_user_id = $1
      WHERE users.id <> $1 
        AND (status.status IS NULL OR status.status NOT IN ('liked', 'blocked'))
        AND users.gender = $2;`,
        [user.id, "male"]
      );
    } else if (user.sexual_preference === "Woman") {
      relevantUsers = await prismaFromWishInstance.customQuery(
        `select users.*
      FROM users 
      LEFT JOIN status 
        on users.id = status.destination_user_id 
        AND status.origin_user_id = $1
      WHERE users.id <> $1 
        AND (status.status IS NULL OR status.status NOT IN ('liked', 'blocked'))
        AND users.gender = $2;`,
        [user.id, "female"]
      );
    } else {
      relevantUsers = await prismaFromWishInstance.customQuery(
        `select users.*
      FROM users 
      LEFT JOIN status 
        on users.id = status.destination_user_id 
        AND status.origin_user_id = $1
      WHERE users.id <> $1 
        AND (status.status IS NULL OR status.status NOT IN ('liked', 'blocked'))`,
        [user.id]
      );
    }
    response
      .status(200)
      .json({
        message: "Found relevant users",
        users: relevantUsers.data?.rows,
      });
  }
);

router.post(
  "/users/firstco",
  authJwtMiddleware,
  [
    body("gender").isString(),
    body("sexual_preference").isString(),
    body("bio").isString(),
    body("age")
      .isInt({ min: 18 })
      .withMessage("You must be at least 18 years old to use this app"),
    body("hashtags").isString(),
  ],
  async (request: Request, response: Response) => {
    console.log("REQUEST", request.body);
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const data = matchedData(request);
    console.log((request.user! as CustomUser).id);
    await prismaFromWishInstance.update(
      "users",
      ["gender", "sex_pref", "bio", "age", "hashtags"],
      [data.gender, data.sexual_preference, data.bio, data.age, data.hashtags],
      ["id"],
      [(request.user! as CustomUser).id]
    );

    response
      .status(200)
      .json({ message: "User profile updated", user: request.user });
  }
);

router.post(
  "/users/upload_images",
  authJwtMiddleware,
  upload.single("image"),
  async (request: Request, response: Response) => {
    try {
      const user = request.user as CustomUser;
      // const file = request.file as Express.Multer.File;
      // const imageBase64 = file.buffer.toString("base64");
      // console.log("IMAGES = " + imageBase64);;
      const url = request.body.url;
      const index = request.body.index;
      await prismaFromWishInstance.update(
        "users",
        ["profile_picture[" + index + "]"],
        [url],
        ["id"],
        [user.id]
      );
      const updatedUser = await prismaFromWishInstance.selectAll(
        "users",
        ["id"],
        [user.id]
      );
      response
        .status(200)
        .json({ message: "Images uploaded", user: updatedUser.data?.rows[0] });
    } catch (error) {
      response.status(500).json({ error: "IMAGE server error" });
    }
  }
);

router.post(
  "/users/clear_image",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    try {
      const user = request.user as CustomUser;
      console.log("INDEX", request.body.index);
      const index = request.body.index;
      await prismaFromWishInstance.update(
        "users",
        ["profile_picture[" + index + "]"],
        [null],
        ["id"],
        [user.id]
      );
      const updatedUser = await prismaFromWishInstance.selectAll(
        "users",
        ["id"],
        [user.id]
      );
      response
        .status(200)
        .json({ message: "Image clear", user: updatedUser.data?.rows[0] });
    } catch (error) {
      response
        .status(500)
        .json({ error: "IMAGE server error: enable to delete" });
    }
  }
);

export default router;
