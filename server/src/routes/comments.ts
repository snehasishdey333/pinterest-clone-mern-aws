
import express from 'express'
import { postCommentsController } from '../controllers/commentController'




const router=express.Router()


router.post("/",postCommentsController)

export default router