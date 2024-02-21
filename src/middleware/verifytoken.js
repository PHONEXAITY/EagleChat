import jwt from "jsonwebtoken";
import { sendForbidden, sendUnauthorized } from "../service/responseHandle.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      console.log('Token not found');
      return sendForbidden(res, 'A token is required for authentication');
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.decoded = decoded; 
      next();
    } catch (err) {
      console.error('Error verifying token:', err);
      return sendUnauthorized(res, 'Invalid token');
    }
  };