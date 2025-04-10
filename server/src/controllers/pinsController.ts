import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { PrismaClient } from "@prisma/client"
import { NextFunction, Request, Response } from "express"

const prisma=new PrismaClient()

export const createPinController=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const file=req.file as Express.Multer.File
        const {title,description,userId,link}=req.body


        const uploadParams={
            Bucket:process.env.S3_BUCKET_NAME,
            Key:`pins/${Date.now()}-${file.originalname}`,
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

        const pin=await prisma.pin.create({
            data:{
                title,
                description,
                userId,
                link:link || "",
                image:imageUrl as string
            }
        })

        res.status(201).json(pin)
       
    }
    catch(error){
        next(error)
    }
}

export const getPinsController=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {search}=req.query
        let pins;
        if(search){
           pins=await prisma.pin.findMany({
            where:{
                OR:[
                    {
                        title:{
                            contains:search as string,
                            mode:"insensitive"
                        },
                    },{
                        description:{
                            contains:search as string,
                            mode:"insensitive"
                        }
                    }
                ]
            }
           })
        }
        else{
            pins=await prisma.pin.findMany()
        }
        
        res.status(200).json(pins)
       
    }
    catch(error){
        next(error)
    }
}

export const getPinController=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        
        const {pinId}=req.params
        
        const pin=await prisma.pin.findUnique({
            where:{
                id:pinId
            },
            include:{
                user:true,
                comments:true
            }

        })
        res.status(200).json(pin)
       
    }
    catch(error){
        next(error)
    }
}