import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth'
import pinRoutes from './routes/pins'
import commentRoutes from './routes/comments'
import userRoutes from './routes/users'
import { errorHandler } from './middleware/error'
import verifyToken from './middleware/verifyToken'


dotenv.config()
const app=express()
app.use(express.json())
app.use(cors({origin:process.env.CLIENT_ORIGIN,credentials:true}))
app.use(cookieParser())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use("/api/auth",authRoutes)
app.use("/api/pins",pinRoutes)
app.use("/api/comments",verifyToken,commentRoutes)
app.use("/api/users",verifyToken,userRoutes)


app.use((err:Error,req:express.Request,res:express.Response,next:express.NextFunction)=>{
    errorHandler(err,req,res,next)
})


const port=Number(process.env.PORT) || 3001
app.listen(port,"0.0.0.0",()=>{
    console.log(`Server running on port ${port}`)
})