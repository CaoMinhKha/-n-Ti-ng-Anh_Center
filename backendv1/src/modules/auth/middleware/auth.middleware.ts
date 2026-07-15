// src/modules/auth/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util.js';
import { AppError } from '../../../middleware/error.middleware.js';


interface AuthenticatedRequest extends Request {

  user?: {

    userId: number;

    email: string;

    role: string;

  };

}



// ===============================
// Normalize Role
// ===============================

function normalizeRole(role: string | undefined): string {

  if (!role) return '';

  const value =
    role
      .toLowerCase()
      .trim();



  switch(value){


    case "hoc_vien":
    case "học viên":
    case "hoc vien":
    case "student":
    case "hv":
    case "3":

      return "student";



    case "giao_vien":
    case "giáo viên":
    case "giao vien":
    case "teacher":
    case "gv":
    case "2":

      return "teacher";



    case "quan_tri_vien":
    case "quản trị viên":
    case "admin":
    case "1":

      return "admin";



    default:

      return value;

  }

}



// ===============================
// Auth Middleware Cookie + Header
// ===============================

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {


  try {


    let token:string | undefined;



    // Cookie

    token =
      req.cookies?.accessToken;



    // Header fallback

    if(!token){

      const authHeader =
        req.headers.authorization;


      if(authHeader){

        const parts =
          authHeader.split(" ");


        if(
          parts.length === 2 &&
          parts[0] === "Bearer"
        ){

          token = parts[1];

        }

      }

    }




    if(!token){

      throw new AppError(
        "Phiên đăng nhập đã hết hạn",
        401
      );

    }



    const decoded =
      verifyAccessToken(token);



    if(!decoded){

      throw new AppError(
        "Token không hợp lệ",
        401
      );

    }



    req.user = {

      userId: decoded.userId,

      email: decoded.email,

      role: normalizeRole(decoded.role)

    };



    next();



  } catch(error){

    next(error);

  }

}





// ===============================
// Role Middleware
// ===============================


export function roleMiddleware(
  allowedRoles:string[]
){


  return (

    req:AuthenticatedRequest,

    res:Response,

    next:NextFunction

  )=>{


    try{


      if(!req.user){

        throw new AppError(
          "Unauthorized",
          401
        );

      }



      const currentRole =
        normalizeRole(req.user.role);



      const roles =
        allowedRoles.map(
          r => normalizeRole(r)
        );



      if(!roles.includes(currentRole)){


        throw new AppError(
          "Bạn không có quyền truy cập chức năng này",
          403
        );


      }



      next();



    }catch(error){

      next(error);

    }


  };

}





// ===============================
// Verified Email
// ===============================


export function verifiedMiddleware(
  req:AuthenticatedRequest,
  res:Response,
  next:NextFunction
){


  next();


}