import { useParams } from "react-router"
import Pin from "../components/Pin"
import { useQuery } from "@tanstack/react-query"
import { fetchUser } from "../utils/apis"
import { PinType } from "../types/types"


const UserDetailsPage = () => {
  const {id}=useParams()
  const {data,isPending,isError}=useQuery({
    queryKey:['userData',id],
    queryFn:()=>fetchUser(id!)
  })

  if(isPending){
    return <p>Loading...</p>
  }
  if(isError){
    return <p>Something went wrong!</p>
  }

  return (
    <div className="w-full mx-auto p-6">
      {/* profile header */}
      <div className="flex flex-col items-center text-center">
       {data?.image ? (<img src={data?.image} alt="img" className="w-20 h-20 rounded-full"/> )
       :
       (<div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold">
         {data?.name.charAt(0)}
       </div>)}
       <h1 className="text-2xl font-semibold mt-2">{data?.name}</h1>
       <p className="text-gray-600">{data?.username}</p>
       <p className="text-gray-500 mt-1"> 202 followers - 20 following</p>
       <div className="mt-4 space-x-2">
        <button className="bg-gray-200 px-4 py-2 rounded-lg cursor-pointer">Message</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer">Follow</button>
       </div>
      </div>

      {/* uploaded images */}
      <div className="mt-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Uploaded Pins</h2>
      {data?.pins?.length > 0 ? (<div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-4 p-4">
        {data?.pins?.map((pin:PinType,index:number)=>(
            <Pin data={pin} index={index}/>
        ))}
    </div>) : 
    (<p className="text-sm">No uploaded pins</p>)}
      </div>
    </div>
  )
}

export default UserDetailsPage