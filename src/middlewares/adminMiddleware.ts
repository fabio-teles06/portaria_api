import { ROLE } from "@prisma/client";
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

const AdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user as any).role === ROLE.ADMIN) {
    next();
  } else {
    return res.status(403).json({ result: false, message: "Access denied" });
  }
};

export default AdminMiddleware;
