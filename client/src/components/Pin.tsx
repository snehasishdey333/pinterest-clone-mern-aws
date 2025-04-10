import { DownloadIcon, Ellipsis } from "lucide-react"
import { Link } from "react-router"
import { PinType } from "../types/types"


const Pin = ({data,index}:{data:PinType,index:number}) => {
  
  return (
    <div key={index}
            className="mb-4 break-inside-avoid relative group overflow-hidden rounded-lg shadow-md"
             >
            <img src={data.image} alt="img" className="w-full rounded-lg transition-transform duration-300 group-hover:scale-105"/>

            {/* hover overlay */}
            <div className="absolute inset-0 bg-black/50 bg-opacity-10 hidden group-hover:flex flex-col justify-between p-3 transition-all duration-300">
               <div className="flex justify-end gap-2">
                 <button className="bg-red-500 px-3 py-2 rounded-full shadow-lg text-[14px] text-white">Save</button>
               </div>

               <div className="flex justify-end gap-2">
                 <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-200">
                   <DownloadIcon size={20}/>
                 </button>
                 <Link to={`/pin/${data.id}`} className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-200">
                  <Ellipsis size={20}/>
                 </Link>
               </div>
            </div>

             </div>   
  )
}

export default Pin