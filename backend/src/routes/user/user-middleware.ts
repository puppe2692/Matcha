import { Router, Response, Request } from "express";
import { body, validationResult, matchedData } from "express-validator";
import prismaFromWishInstance from "../../database/prismaFromWish";
import { PrismaReturn } from "../../data_structures/data";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
	destination: (request, file, callback) => {
		const destinationDir = "./images"; // Specify the destination directory
		if (!fs.existsSync(destinationDir)) { // Check if the directory exists
			fs.mkdirSync(destinationDir, { recursive: true }); // Create the directory if it doesn't exist
		}
		callback(null, destinationDir);
	},
	filename: (request, file, callback) => {
		console.log("FILE MDDLWARE", file);
		callback(null, Date.now() + "_" + file.originalname);
	},
});

export const upload = multer({ storage: storage });	// Create a new multer instance
