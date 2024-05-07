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
    // console.log("USER", user);
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
    if (user.sex_pref === "Male") {
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
    } else if (user.sex_pref === "Female") {
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
    response.status(200).json({
      message: "Found relevant users",
      users: relevantUsers.data?.rows,
    });
  }
);

router.put(
  "/users/update_location",
  authJwtMiddleware,
  [body("latitude").isNumeric(), body("longitude").isNumeric()],
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const data = matchedData(request);
    await prismaFromWishInstance.update(
      "users",
      ["latitude", "longitude"],
      [data.latitude, data.longitude],
      ["id"],
      [(request.user! as CustomUser).id]
    );
    response.status(200).json({
      message: "Updated user location",
    });
  }
);

router.post(
  "/users/firstco",
  authJwtMiddleware,
  [
    body("gender").isString(),
    body("sex_pref").isString(),
    body("bio").isString(),
    body("age")
      .isInt({ min: 18 })
      .withMessage("You must be at least 18 years old to use this app"),
    body("hashtags").isArray(),
  ],
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const data = matchedData(request);
    await prismaFromWishInstance.update(
      "users",
      ["gender", "sex_pref", "bio", "age", "hashtags"],
      [data.gender, data.sex_pref, data.bio, data.age, data.hashtags],
      ["id"],
      [(request.user! as CustomUser).id]
    );
    const updatedUser = await prismaFromWishInstance.selectAll(
      "users",
      ["id"],
      [(request.user! as CustomUser).id]
    );
    response.status(200).json({
      message: "User profile updated",
      user: updatedUser.data?.rows[0],
    });
  }
);

router.post(
  "/users/upload_images",
  authJwtMiddleware,
  upload.single("image"),
  async (request: Request, response: Response) => {
    try {
      const user = request.user as CustomUser;
      const file = request.file as Express.Multer.File;
      // const imageBase64 = file.buffer.toString("base64");
      // console.log("IMAGES = " + imageBase64);;
      const url = request.body.url;
      const index = request.body.index;
      console.log("INDEX", index);
      console.log("FILE", file);
      await prismaFromWishInstance.update(
        "users",
        ["profile_picture[" + index + "]"],
        [file.filename],
        ["id"],
        [user.id]
      );
      const updatedUser = await prismaFromWishInstance.selectAll(
        "users",
        ["id"],
        [user.id]
      );
      console.log("UPDATED USER", updatedUser.data?.rows[0]);
      response
        .status(200)
        .json({ message: "Images uploaded", user: updatedUser.data?.rows[0] });
    } catch (error) {
      response.status(500).json({ error: "IMAGE server error" });
    }
  }
);

router.get(
  "/users/get_img/:id",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const index = Number(request.query.index);
    const userImg = await prismaFromWishInstance.selectAll(
      "users",
      ["id"],
      [request.params.id]
    );
    if (!userImg.data?.rows[0].profile_picture[index]) {
      return response.status(404).json({ error: "Image not found" });
    }
    return response.sendFile(userImg.data?.rows[0].profile_picture[index], {
      root: "./images",
    });
  }
);

router.post(
  "/users/clear_image",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    try {
      const user = request.user as CustomUser;
      console.log("INDEX BACKEND", request.body.index);
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
      console.log("UPDATED USER", updatedUser.data?.rows[0]);
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

router.post(
  "/users/update_profile",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const allowedFields = ["gender", "sex_pref", "bio", "age", "hashtags"];
    const updateFields: { [key: string]: any } = {};

    // Iterate through allowed fields and add them to updateFields object if present in request body
    allowedFields.forEach((field) => {
      if (request.body[field] !== undefined) {
        updateFields[field] = request.body[field];
      }
    });

    // Check if any fields were provided in the request body
    if (Object.keys(updateFields).length === 0) {
      return response
        .status(400)
        .json({ error: "No fields to update provided" });
    }

    // Execute update query with the provided fields
    try {
      await prismaFromWishInstance.update(
        "users",
        Object.keys(updateFields), // Use Object.keys to get an array of field names
        Object.values(updateFields), // Use Object.values to get an array of field values
        ["id"],
        [(request.user! as CustomUser).id]
      );

      const updatedUser = await prismaFromWishInstance.selectAll(
        "users",
        ["id"],
        [(request.user! as CustomUser).id]
      );

      console.log("UPDATED USER", updatedUser.data?.rows[0]);
      response.status(200).json({
        message: "User profile updated",
        user: updatedUser.data?.rows[0],
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/users/profile/:username",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    const errors = validationResult(request); // Check for validation errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const username = request.params.username;
    const user = await prismaFromWishInstance.selectAll(
      "users",
      ["username"],
      [username]
    );
    if (user.data?.rows.length === 0) {
      return response.status(404).json({ error: "User not found" });
    }
    delete user.data?.rows[0].password;
    return response.status(200).json(user.data?.rows[0]);
  }
);

router.get(
  "/users/get_relations",
  authJwtMiddleware,
  async (request: Request, response: Response) => {
    console.log("GET RELATION 1");
    try {
      // console.log("request.body", request);
      console.log("originId", request.query.originId);
      console.log("destinationId", request.query.destinationId);
      const originId = Number(request.query.originId);
      const destinationId = Number(request.query.destinationId);
      const status = await prismaFromWishInstance.selectAll(
        "status",
        ["origin_user_id", "destination_user_id"],
        [originId, destinationId]
      );
      const connection = await prismaFromWishInstance.selectAll(
        "connection",
        ["origin_user_id", "destination_user_id"],
        [Math.min(originId, destinationId), Math.max(originId, destinationId)]
      );
      console.log("STATUS", status.data?.rows[0].status);
      console.log("CONNECTION", connection);
      response.status(200).json({
        status: status.data?.rows[0].status,
        connection: connection.data?.rows[0],
      });
    } catch (error) {
      response
        .status(400)
        .json({ error: " get relation: Internal server error" });
    }
  }
);

export default router;
