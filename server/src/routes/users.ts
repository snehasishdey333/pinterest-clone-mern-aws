
import express from 'express'
import multer from 'multer'
import { getUsercontroller, updateUserController } from '../controllers/userController'



const router=express.Router()
const storage=multer.memoryStorage()
const upload=multer({storage:storage})

router.get("/:userId",getUsercontroller)

router.put("/:userId",upload.single("file"),updateUserController)

export default router