import { auth as betterAuth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { Request, Response, NextFunction } from "express";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}
const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get user session from better-auth
      const session = await betterAuth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // req.user mapping follows

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };
      // console.log(req.user.role);
      if (roles.length && !roles.includes(session.user.role as UserRole)) {
        return res.status(403).json({
          message:
            "Forbidden! You don't have permission to access this resource.",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
