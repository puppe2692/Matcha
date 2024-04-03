import { Router, Response, Request } from 'express';
import { body, validationResult, matchedData } from 'express-validator';
import prismaFromWishInstance from "../../database/prismaFromWish";
import passport from "passport";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Token generation

async function signToken(userId: Number, email: String, username: String, accessToken: Boolean) {
	const payload = { userId: userId, email: email, username: username };
	const secret = process.env.JWT_SECRET!;

	if (accessToken) {
		const token = await jwt.sign(payload, secret , { expiresIn: "1h" });
		return { JWTtoken: token };
	} else {
		const token = await jwt.sign(payload, secret , { expiresIn: "7d" });
		return { JWTtoken: token };
	}

}

export async function generateToken(userId: Number, email: String, username: String, res: Response) {
	const accessToken = await signToken(userId, email, username, true);

	res.cookie("access_token", accessToken.JWTtoken, {
		httpOnly: false,
		secure: false,
		sameSite: 'strict',
		maxAge: 3600000,
	});
}

// Mail verification

export async function generateMailToken(userId: Number, email: string){
	const token = crypto.randomBytes(32).toString('hex');
	const userToken = await prismaFromWishInstance.create(
		"tokens",
		["token", "user_id"],
		[token, userId]
	);
	if (!userToken.data) {
		return { error: userToken.errorMessage };
	} else {
		const url = `${process.env.BASE_URL}/auth/${userId}/verify/${token}`;
		await sendVerificationMail(email, "MATCHA: Verify your email", `Click on the following link to verify your email: ${url}`);
	}
}


export async function sendVerificationMail(email: string, subject: string, text: string) {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			service: process.env.MAIL_SERVICE,
			port: parseInt(process.env.MAIL_PORT!),
			secure: Boolean(process.env.MAIL_SECURE),
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS
			}
		});

		await transporter.sendMail({
			from: process.env.MAIL_USER,
			to: email as string,
			subject: subject,
			text: text
		});
		console.log("Email sent successfully");
	} catch (error) {
		console.log("Error sending email");
		console.log(error);
	}
}