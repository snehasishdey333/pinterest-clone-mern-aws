import { Bell, Compass, Home, MessageCircle, Plus, User } from "lucide-react"
import { Link } from "react-router"


const Sidebar = () => {
  return (
    <div className="w-14 md:w-16 flex flex-col items-center py-4 border-r sticky h-screen top-0 border-gray-100">
      <Link to="/">
      <img className="w-8 h-8 rounded-full mb-6" src="/assets/asset 158.svg" alt="logo"/>
      </Link>

      <div className="flex flex-col items-center gap-6 mt-2">

        <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
        <Home className="h-6 w-6"/>
        </Link>

        <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
        <Compass className="h-6 w-6"/>
        </Link>

        <Link to="/create" className="p-2 rounded-full hover:bg-gray-100">
        <Plus className="h-6 w-6"/>
        </Link>

        <Link to="/" className="p-2 rounded-full hover:bg-gray-100 relative">
        <Bell className="h-6 w-6"/>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">36</span>
        </Link>

        <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
        <MessageCircle className="h-6 w-6"/>
        </Link>

        <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100">
        <User className="h-6 w-6"/>
        </Link>

      </div>
    </div>
  )
}

export default Sidebar