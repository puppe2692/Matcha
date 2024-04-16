import { Router, Response, Request } from 'express';
import { body, validationResult, matchedData } from 'express-validator';
import prismaFromWishInstance from "../../database/prismaFromWish";
import { CustomUser } from '../../interfaces';
import { upload_images } from './user-middleware';
import { authJwtMiddleware } from '../auth/auth-middleware';

const router = Router();	// Create a new router

router.get("/users/me", authJwtMiddleware, async (request: Request, response: Response) => {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}
	const user = request.user as CustomUser;
	delete user.password;
	console.log(user);
	response.status(200).json(user);
});

router.post("/users/firstco", authJwtMiddleware, [
	body("gender").isString(),
	body("sexual_preference").isString(),
	body("bio").isString(),
	body("age").isInt({ min: 18 }).withMessage("You must be at least 18 years old to use this app"),
	body("hashtags").isString(),
	], async (request: Request, response: Response) => {
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
		[(request.user! as CustomUser).id],
	);

	response.status(200).json({ message: "User profile updated", user: request.user });

});

router.post("/users/upload_images", authJwtMiddleware, upload_images.single('image'), async (request: Request, response: Response) => {
	try {
		const user = request.user as CustomUser;
		console.log("REQUEST FILES = " + request.files);
		const file = request.file as Express.Multer.File;
		console.log("FILES = " + file);
		const imageBase64 = file.buffer.toString("base64");
		console.log("IMAGES = " + imageBase64);
		await prismaFromWishInstance.create(
			"images",
			["token", "user_id", "index"],
			[imageBase64, user.id, request.body.index],
		);
		response.status(200).json({ message: "Images uploaded" });
	} catch (error) {
		response.status(500).json({ error: "IMAGE server error" });
	}
});

export default router;