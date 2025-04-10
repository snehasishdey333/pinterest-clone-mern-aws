import { PrismaClient } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { CustomError } from "../middleware/error"

const prisma=new PrismaClient()


export const postCommentsController=async(req:Request,res:Response,next:NextFunction)=>{
    try{
       const {comment,pinId,userId}=req.body
       if(!comment || !pinId || !userId){
         throw new CustomError(400,"All fields are required!")
       }
       const pinExist=await prisma.pin.findUnique({
        where:{
            id:pinId
        }
       })

       if(!pinExist){
        throw new CustomError(404,"Pin does not exist!")
       }
       const newComment=await prisma.comment.create({
        data:{
            comment,
            pinId,
            userId
        }
       })
       res.status(200).json(newComment)
    }
    catch(error){
        next(error)
    }
}