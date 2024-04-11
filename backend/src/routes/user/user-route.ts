import { Router, Response, Request } from 'express';
import { body, validationResult, matchedData } from 'express-validator';
import prismaFromWishInstance from "../../database/prismaFromWish";
import passport from "passport";
import { generateToken, generateMailToken, deleteToken, generatePasswordToken, hashPassword, comparePassword } from "../auth/auth-utils";
import { authJwtMiddleware } from '../auth/auth-middleware';

const router = Router();	// Create a new router

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

router.get("/users/me", authJwtMiddleware, async (request: Request, response: Response) => {
	const user = request.user as CustomUser;
	delete user.password;
	console.log(user);
	response.status(200).json(user);
});

export default router;