import { Router, Response, Request } from 'express';
import { body, validationResult, matchedData } from 'express-validator';
import prismaFromWishInstance from "../../database/prismaFromWish";
import passport from "passport";
import { generateToken, generateMailToken } from "./auth-utils";

const router = Router();	// Create a new router

router.post("/auth/signup", [
	body("email").isEmail(),
	body("password").isLength({ min: 8, max: 32}),
	body("username").isLength({ min: 3, max: 32}),
	body("lastname").isLength({ min: 3, max: 32}),
	body("firstname").isLength({ min: 3, max: 32}),
	], async (request: Request, response: Response) => {
	const errors = validationResult(request);	// Check for validation errors
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}
	const data = matchedData(request);	// Sanitize the data
	const user = await prismaFromWishInstance.create(
		"users",
		["username", "email", "password", "firstname", "lastname"],
		[data.username, data.email, data.password, data.firstname, data.lastname]
	);
	if (!user.data) {
		return response.status(400).json({ error: user.errorMessage });
	} else {
		console.log(user.data);
		await generateToken(user.data.rows[0].id, data.email, data.username, response)
		response.json({ message: "User succesfully created, an email as been sent to you to verify your account" });
		}
		await generateMailToken(user.data.rows[0].id, data.email);
	}
)

router.post("/auth/signin", [
	body("username").isLength({ min: 3, max: 32}),
	body("password").isLength({ min: 8, max: 32}),
	], async (request: Request, response: Response) => {
	const errors = validationResult(request);	// Check for validation errors
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}
	const data = matchedData(request);	// Sanitize the data
	const user = await prismaFromWishInstance.selectAll(
		"users",
		["username", "password"],
		[data.username, data.password]
	);
	if (!user.data || user.data.rows.length == 0) {
		return response.status(400).json({ error: "Invalid credentials" });
	} else {
		if (!user.data.rows[0].verified) {
			const token = await prismaFromWishInstance.selectAll(
				"tokens",
				["user_id"],
				[user.data.rows[0].id]
			)	;
			const currentTimestamp = new Date().getTime();	// Get the current timestamp
			if (!token.data || token.data.rows[0].expires_at.getTime() > currentTimestamp) {
				await generateMailToken(user.data.rows[0].id, user.data.rows[0].email);
			}
			return response.status(400).json({ error: "User not verified" });
		}
		await generateToken(user.data.rows[0].id, user.data.rows[0].email, user.data.rows[0].username, response)
		response.json({ message: "User succesfully signed in" });
		}
	}
)

router.get("/auth/:id/verify/:token", async (request: Request, response: Response) => {
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
		await prismaFromWishInstance.update(
			"users",
			["verified"],
			[true],
			["id"],
			[request.params.id],
		);
		await prismaFromWishInstance.delete(
			"tokens",
			["token", "user_id"],
			[request.params.token, request.params.id]
		);
		response.json({ message: "User succesfully verified" });
	} catch (error) {
		response.status(400).json({ error: "Internal Server Error" });
	}
});



export default router;	// Export the router