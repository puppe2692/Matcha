import { Router, Response, Request } from 'express';
import { body, validationResult, matchedData } from 'express-validator';
import prismaFromWishInstance from "../../database/prismaFromWish";
import passport from "passport";
import { PrismaReturn } from '../../data_structures/data';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';



const jwtOptions: any = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET! // Remplacez cela par votre propre clé secrète
  };
  
  passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
	try {
		console.log(jwtPayload.id);
	  const user = await prismaFromWishInstance.selectAll(
		"users",
		["id"],
		[jwtPayload.id]
	); // Recherchez l'utilisateur par ID dans la base de données
	  if (user.data) {
		return done(null, user); // Si l'utilisateur est trouvé, renvoyez-le
	  } else {
		return done(null, false); // Sinon, indiquez qu'aucun utilisateur n'a été trouvé
	  }
	} catch (error) {
	  return done(error, false); // En cas d'erreur, signalez une erreur
	}
  }));


export function authJwtMiddleware(request: Request, response: Response, next: any) {
	passport.authenticate('jwt', { session: false }, (error: Error, user: PrismaReturn) => {
		console.log(user);
		if (error || !user) {
			console.log(error);
			return response.status(401).json({ error: "Unauthorized" });
		}
		request.user = user;
		return next();
	})(request, response, next);
}