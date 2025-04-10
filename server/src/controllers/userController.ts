import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { PrismaClient } from "@prisma/client"
import { NextFunction, Request, Response } from "express"

const prisma=new PrismaClient()

export const getUsercontroller=async(req:Request,res:Response,next:NextFunction)=>{
   try{
      const {userId}=req.params
      const user=await prisma.user.findUnique({
        where:{
            id:userId
        },
        include:{
            pins:true
        }
      })
      res.status(200).json(user)
   }
   catch(error){
    next(error)
   }
}

export const updateUserController=async(req:Request,res:Response,next:NextFunction)=>{
   try{
            const file=req.file as Express.Multer.File
            const {userId}=req.params
    
    
            const uploadParams={
                Bucket:process.env.S3_BUCKET_NAME,
                Key:`users/${Date.now()}-${file.originalname}`,
                Body:file.buffer,
                contentType:file.mimetype
            }
    
            const s3Client=new S3Client({
                region:process.env.AWS_REGION
            })
    
            const uploadResult=await new Upload({
                client:s3Client,
                params:uploadParams
            }).done()
    
            const imageUrl=uploadResult.Location
            const updatedUser=await prisma.user.update({
                where:{
                    id:userId
                },
                data:{
                    image:imageUrl as string
                }
            })
            res.status(200).json(updatedUser)
   }
   catch(error){
    next(error)
   }
}