import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../../enums/statusCode.enums';
import JwtService from '../utils/jwtService.utils';

const jwtService = new JwtService();

export const authAdminJwt = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(StatusCodes.Unauthorized).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwtService.verifyToken(token)

    if (decoded.type !== 'Admin') {
      res.clearCookie('token', { httpOnly: true });
      res.clearCookie('refreshToken',{ httpOnly: true })

      res.status(StatusCodes.Unauthorized).json({ error: 'Access denied' })
      return;
    }
    next();
  } catch (error) {
    return res.status(StatusCodes.Unauthorized).json({ message: 'Invalid token' });
  }
};