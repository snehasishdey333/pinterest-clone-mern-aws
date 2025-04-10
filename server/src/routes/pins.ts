
import express from 'express'
import { createPinController, getPinController, getPinsController } from '../controllers/pinsController'
import multer from 'multer'
import verifyToken from '../middleware/verifyToken'



const router=express.Router()
const storage=multer.memoryStorage()
const upload=multer({storage:storage})


router.post("/",upload.single("file"),createPinController)

router.get("/",getPinsController)

router.get("/:pinId",verifyToken,getPinController)


export default router