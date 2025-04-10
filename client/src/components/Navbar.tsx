import { Search } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import Menu from "./Menu"
import { useAuthStore } from "../store/AuthStore"


const Navbar = () => {
    const [searchQuery,setSearchQuery]=useState("")
    const [menuOpen,setMenuOpen]=useState(false)
    const {currentUser}=useAuthStore()
    const navigate=useNavigate()

  return (
    <div className="flex items-center justify-between px-4 py-2 sticky top-0 h-[60px] w-full z-10 bg-white space-x-2"> 
       
       {/* Search bar section */}
       <div className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2">
         <Search onClick={()=>navigate(`/search?search=${searchQuery}`)} className="h-5 w-5 text-gray-500"/>
         <input 
         type="text"
         className="w-full bg-transparent outline-none px-2"
         placeholder="Search..."
         value={searchQuery}
         onChange={(e)=>setSearchQuery(e.target.value)}
         />   
       </div>

       {/* profile section */}
     {currentUser? (<div onClick={()=>setMenuOpen((prev)=>!prev)} className="flex space-x-2 items-center justify-center relative">
       {currentUser?.image ? 
       <img src={currentUser?.image} alt="img" className="w-8 h-8 rounded-full cursor-pointer"/>
       :
       (<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-sm">
        {currentUser?.name?.charAt(0)}
       </div>)}
       <div className="flex items-center justify-center h-8 w-8 hover:bg-gray-200 rounded-full">
         <img src="/assets/asset 155.svg" alt="arrow" className="w-4 h-4 rounded-full"/>
       </div>
       {menuOpen && <Menu/>}
     </div>
     )
     :
     (<div>
      <button onClick={()=>navigate("/auth")} className="bg-red-500 rounded-3xl text-white p-2 md:w-[100px] cursor-pointer">Login</button>
     </div>)}
    </div>
  )
}

export default Navbar