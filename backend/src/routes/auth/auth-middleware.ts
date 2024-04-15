import { Router, Response, Request } from "express";
import { body, validationResult, matchedData } from "express-validator";
import prismaFromWishInstance from "../../database/prismaFromWish";
import passport from "passport";
import { PrismaReturn } from "../../data_structures/data";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const jwtOptions: any = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (request: Request) => {
      const data = (request as any).headers.cookie;
      if (data) {
        const regex = new RegExp(
          `${process.env.JWT_ACCESS_TOKEN_COOKIE}=([^;]+)`
        ); // Expression régulière pour extraire la partie du cookie
        const match = data.match(regex); // Chercher la correspondance dans le cookie
        if (match) {
          return match[1]; // Retourner la partie correspondante du cookie
        }
      }
      return null;
    },
  ]),
  secretOrKey: process.env.JWT_SECRET!, // Remplacez cela par votre propre clé secrète
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await prismaFromWishInstance.selectAll(
        "users",
        ["id"],
        [jwtPayload.userId]
      ); // Recherchez l'utilisateur par ID dans la base de données
      if (user.data) {
        return done(null, user); // Si l'utilisateur est trouvé, renvoyez-le
      } else {
        return done(null, false); // Sinon, indiquez qu'aucun utilisateur n'a été trouvé
      }
    } catch (error) {
      return done(error, false); // En cas d'erreur, signalez une erreur
    }
  })
);

export function authJwtMiddleware(
  request: Request,
  response: Response,
  next: any
) {
  passport.authenticate(
    "jwt",
    { session: false },
    (error: Error, user: PrismaReturn) => {
      if (error || !user) {
        return response.status(401).json({ error: "Unauthorized ma couille" });
      }
      request.user = user.data!.rows[0];
      return next();
    }
  )(request, response, next);
}
