import {Request, Response, NextFunction} from "express";
import {RequestWithAdmin} from "./auth";

const permit = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const admin = (req as RequestWithAdmin).admin;

    if (admin && !roles.includes(admin.role)) {
      return res.status(403).send({error: 'Low level of rights'});
    }

    next();
  };
}

export default permit;