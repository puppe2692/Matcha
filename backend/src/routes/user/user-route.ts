import { Router, Response, Request } from 'express';
import { body, validationResult, matchedData } from 'express-validator';
import prismaFromWishInstance from "../../database/prismaFromWish";
import { authJwtMiddleware } from '../auth/auth-middleware';
import { CustomUser } from '../../interfaces';
import { upload_images } from './user-middleware';

const router = Router();	// Create a new router

router.get("/users/me", authJwtMiddleware, async (request: Request, response: Response) => {
	const user = request.user as CustomUser;
	delete user.password;
	console.log(user);
	response.status(200).json(user);
});

router.post("users/firstco", authJwtMiddleware, [
	body("gender").isString(),
	body("sexual_preference").isString().matches(/^(Male|Female|Other)$/),
	body("bio").isString(),
	body("age").isInt({ min: 18 }).withMessage("You must be at least 18 years old to use this app"),
	body("hastags").isArray().isLength({ min: 1 }),
	body("profile_picture").isArray().isLength({ min: 1, max: 5}),
	], async (request: Request, response: Response) => {

	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}
	const data = matchedData(request);
	await prismaFromWishInstance.update(
		"users",
		["gender", "sexual_preference", "bio", "age", "hastags", "profile_picture"],
		[data.gender, data.sexual_preference, data.bio, data.age, data.hastags, data.profile_picture],
		["id"],
		[(request.user! as CustomUser).id],
	);
	response.status(200).json({ message: "User profile updated" });

});

router.post("/users/upload_images", authJwtMiddleware, upload_images.array('Images'), async (request: Request, response: Response) => {
	//const user = request.user as CustomUser;
	console.log("REQUEST FILES = " + request.files);
	const files = request.files as Express.Multer.File[];
	console.log("FILES = " + files);
	const images = files.map((file) => file.filename);
	console.log("IMAGES = " + images);
	// await prismaFromWishInstance.update(
	// 	"users",
	// 	["profile_picture"],
	// 	[images],
	// 	["id"],
	// 	[user.id],
	// );
	response.status(200).json({ message: "Images uploaded" });
});

export default router;