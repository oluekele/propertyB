import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) next();
  else res.status(403).json({ message: 'Admin access only' });
};
