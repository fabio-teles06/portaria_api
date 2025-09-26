import { ROLE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export default (roles: ROLE[] = [ROLE.ADMIN]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ result: false, message: "Unauthorized" });
    }

    if (roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ result: false, message: "Forbidden" });
  };
};
