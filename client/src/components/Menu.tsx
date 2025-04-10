import { Link, useNavigate } from "react-router"
import { apiClient } from "../utils/apiClient"
import { useAuthStore } from "../store/AuthStore"

const Menu = () => {
  const {removeCurrentUser}=useAuthStore()
  const navigate=useNavigate()

  const handleLogout=async()=>{
    try{
      await apiClient.get("/api/auth/logout")
      removeCurrentUser()
      navigate("/auth")
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div className="absolute right-0 top-10 z-10 px-3 py-2 flex flex-col items-start bg-white text-[14px] rounded-md w-[100px]">
     <Link to="/create" className="p-2 rounded-full hover:bg-gray-100 w-full">Crete</Link> 
     <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100 w-full">Profile</Link> 
     <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-100 w-full">Log Out</button> 
    </div>
  )
}

export default Menu