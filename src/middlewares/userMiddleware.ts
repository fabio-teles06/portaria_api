import { ROLE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

interface AuthUser {
  id: number;
  email: string;
  role: ROLE;
  // outros campos que você salvar no token
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser | null;
      condominiumId?: number;
    }
  }
}

const UserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ result: false, message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ result: false, message: "Token invalid" });
    }

    var user = (decoded as any).user;
    req.user = user;
    req.condominiumId = user.condominiumId;
    next();
  });
};

export default UserMiddleware;
