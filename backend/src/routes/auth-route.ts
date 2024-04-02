import { Router, Response, Request } from 'express';
import { body, validationResult, matchedData } from 'express-validator';

const router = Router();	// Create a new router

router.post("/auth/signup", [
	body("email").isEmail(),
	body("password").isLength({ min: 8, max: 32}),
	body("username").isLength({ min: 3, max: 32}),
	body("lastname").isLength({ min: 3, max: 32}),
	body("firstname").isLength({ min: 3, max: 32}),
	], (request: Request, response: Response) => {
	const errors = validationResult(request);	// Check for validation errors
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}
	const data = matchedData(request);	// Sanitize the data
	response.json({ message: "User succesfully created" });
	}
)

export default router;	// Export the router