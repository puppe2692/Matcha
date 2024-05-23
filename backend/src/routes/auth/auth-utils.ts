import { Router, Response, Request } from "express";
import { body, validationResult, matchedData } from "express-validator";
import prismaFromWishInstance from "../../database/prismaFromWish";
import passport from "passport";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { PrismaReturn } from "../../data_structures/data";

// Token generation

async function signToken(
  userId: Number,
  email: String,
  username: String,
  accessToken: Boolean
) {
  const payload = { userId: userId, email: email, username: username };
  const secret = process.env.JWT_SECRET!;

  if (accessToken) {
    const token = await jwt.sign(payload, secret, { expiresIn: "1d" });
    return { JWTtoken: token };
  } else {
    const token = await jwt.sign(payload, secret, { expiresIn: "7d" });
    return { JWTtoken: token };
  }
}

export async function generateToken(
  userId: Number,
  email: String,
  username: String,
  res: Response
) {
  const accessToken = await signToken(userId, email, username, true);

  res.cookie(process.env.JWT_ACCESS_TOKEN_COOKIE!, accessToken.JWTtoken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 3600000,
  });
}

// Mail verification

export async function generateMailToken(userId: Number, email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const userToken = await prismaFromWishInstance.create(
    "tokens",
    ["token", "user_id"],
    [token, userId]
  );
  if (!userToken.data) {
    return { error: userToken.errorMessage };
  } else {
    const url = `${process.env.BASE_URL}/auth/${userId}/verify/${token}`;
    await sendVerificationMail(
      email,
      "MATCHA: Verify your email",
      `Click on the following link to verify your email: ${url}`
    );
  }
}

export async function sendVerificationMail(
  email: string,
  subject: string,
  text: string
) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      service: process.env.MAIL_SERVICE,
      port: parseInt(process.env.MAIL_PORT!),
      secure: Boolean(process.env.MAIL_SECURE),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email as string,
      subject: subject,
      text: text,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteToken(token: string, userId: Number) {
  const userToken = await prismaFromWishInstance.delete(
    "tokens",
    ["token", "user_id"],
    [token, userId]
  );
  if (!userToken.data) {
    return { error: userToken.errorMessage };
  }
}

// Password verification
export async function generatePasswordToken(user: PrismaReturn, email: string) {
  const token = await prismaFromWishInstance.selectAll(
    "tokens",
    ["user_id"],
    [user.data!.rows[0].id]
  );
  const currentTimestamp = new Date().getTime(); // Get the current timestamp
  if (
    token.data &&
    token.data.rows.length != 0 &&
    token.data.rows[0].expires_at.getTime() > currentTimestamp
  )
    await deleteToken(token.data.rows[0].token, user.data!.rows[0].id);
  const passToken = crypto.randomBytes(32).toString("hex");
  const userToken = await prismaFromWishInstance.create(
    "tokens",
    ["token", "user_id"],
    [passToken, user.data!.rows[0].id]
  );
  if (!userToken.data) {
    return { error: userToken.errorMessage };
  } else {
    // const url = `${process.env.BASE_URL}/auth/resetpassword/${
    //   user.data!.rows[0].id
    // }/${passToken}`;
    const url = ` http://localhost:3000/resetpassword?id=${user.data!.rows[0].id}&token=${passToken}`;
    await sendVerificationMail(
      email,
      "MATCHA: Reset your password",
      `Click on the following link to Reset your password: ${url}`
    );
  }
}

// Hashing password

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function comparePassword(password: string, hash: string) {
  const match = await bcrypt.compare(password, hash);
  return match;
}
