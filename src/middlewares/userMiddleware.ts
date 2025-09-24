import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

// request.user and request.tenantId will be available
declare global {
  namespace Express {
    interface Request {
      user?: string | object;
      tenantId?: number;
    }
  }
}

const UserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ result: false, message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ result: false, message: "Token invalid" });
    }

    req.user = decoded;
    req.tenantId = (decoded as any).tenantId;
    next();
  });
};

export default UserMiddleware;
