import { Router, Response, Request } from "express";
import { body, validationResult, matchedData } from "express-validator";
import prismaFromWishInstance from "../../database/prismaFromWish";
import { PrismaReturn } from "../../data_structures/data";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: (request, file, callback) => {
		callback(null, "../../images");
	},
	filename: (request, file, callback) => {
		console.log(file);
		callback(null, Date.now() + "_" + path.extname(file.originalname));
	},
});

export const upload_images = multer({ storage: storage });	// Create a new multer instance
