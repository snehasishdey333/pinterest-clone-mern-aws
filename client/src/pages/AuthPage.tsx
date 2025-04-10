import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
// import { useNavigate } from "react-router"
import { z } from "zod"
import { apiClient } from "../utils/apiClient"
import { useNavigate } from "react-router"
import { useAuthStore } from "../store/AuthStore"

const signupSchema=z.object({
  name:z.string().min(3,"Name must be atleast 3 characters"),
  username:z.string().min(5,"Username must be atleast 5 characters and unique"),
  email:z.string().email("Invalid email address"),
  password:z.string().min(6,"Password must be atleast 6 characters"),
})

const loginSchema=z.object({
  email:z.string().email("Invalid email address"),
  password:z.string().min(1,"Password can not be empty"),
})

type SignupFormData=z.infer<typeof signupSchema>
type LoginFormData=z.infer<typeof loginSchema>

const AuthPage = () => {
  const [isSignup,setIsSignup]=useState(false)
  const navigate=useNavigate()
  const {setCurrentUser}  = useAuthStore()
  const {
    register:registerSignup,
    handleSubmit:handleSubmitSignup,
    formState:{errors:errorsSignup},
    reset:resetSignup
  }=useForm<SignupFormData>({
    resolver:zodResolver(signupSchema)
  })
  const {
    register:registerLogin,
    handleSubmit:handleSubmitLogin,
    formState:{errors:errorsLogin},
    reset:resetLogin
  }=useForm<LoginFormData>({
    resolver:zodResolver(loginSchema)
  })

  useEffect(()=>{
    if(isSignup){
      resetSignup()
    }
    else{
      resetLogin()
    }
  },[isSignup,resetLogin,resetSignup])

  const onSubmitSignup=async(data:SignupFormData)=>{
    try{
      const res=await apiClient.post("/api/auth/register",data)
      setCurrentUser(res.data)
      navigate("/")
    }
    catch(error){
      console.log(error)
    }
  }
  const onSubmitLogin=async(data:LoginFormData)=>{
    try{
      const res=await apiClient.post("/api/auth/login",data)
      setCurrentUser(res.data)
      navigate("/")
    }
    catch(error){
      console.log(error)
    }
  }

  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-100">
     <div className="bg-whte shadow-md rounded-lg p-6 w-96">
        <img src="/assets/asset 154.svg" alt="Pinterest" className="w-40 mx-auto mb-6"/>
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isSignup ? "Sign Up for Pinterest":"Welcome back to Pinterest"}
        </h2>
        {isSignup ? (<form onSubmit={handleSubmitSignup(onSubmitSignup)} key="signup" className="flex flex-col space-y-4">
          <div>
            <input 
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 rounded-lg p-2 w-full"
            {...registerSignup("name")}
            />
            {errorsSignup.name && <p className="text-sm text-red-500">{errorsSignup.name.message}</p>}
          </div>
          <div>
            <input 
            type="text"
            placeholder="Username"
            className="border border-gray-300 rounded-lg p-2 w-full"
            {...registerSignup("username")}
            />
            {errorsSignup.username && <p className="text-sm text-red-500">{errorsSignup.username.message}</p>}
          </div>
          <div>
            <input 
            type="text"
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-2 w-full"
            {...registerSignup("email")}
            />
            {errorsSignup.email && <p className="text-sm text-red-500">{errorsSignup.email.message}</p>}
          </div>
          <div>
            <input 
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-2 w-full"
            {...registerSignup("password")}
            />
            {errorsSignup.password && <p className="text-sm text-red-500">{errorsSignup.password.message}</p>}
          </div>
          <button type="submit" className="bg-red-500 text-white w-full cursor-pointer p-2 rounded-lg mt-4">Sign Up</button>
        </form>)
        :
        (<form onSubmit={handleSubmitLogin(onSubmitLogin)} key="login" className="flex flex-col space-y-4">
          <div>
            <input 
            type="text"
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-2 w-full"
            {...registerLogin("email")}
            />
            {errorsLogin.email && <p className="text-sm text-red-500">{errorsLogin.email.message}</p>}
          </div>
          <div>
            <input 
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-2 w-full"
            {...registerLogin("password")}
            />
            {errorsLogin.password && <p className="text-sm text-red-500">{errorsLogin.password.message}</p>}
          </div>
          <button type="submit" className="bg-red-500 text-white w-full cursor-pointer p-2 rounded-lg mt-4">Log In</button>
        </form>)}
        <p className="text-sm text-center mt-4">
         {isSignup ? 'Already have an account?' : "Don't have an account?"}
         <span onClick={()=>setIsSignup((prev)=>!prev)} className="text-red-500 cursor-pointer ml-1">{isSignup ? "Log In" : "Sign Up"}</span>
        </p>
     </div>
   </div>
  )
}

export default AuthPage