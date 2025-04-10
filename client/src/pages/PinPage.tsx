import { useNavigate, useParams } from "react-router"
import CommentForm from "../components/CommentForm"
import { useQuery } from "@tanstack/react-query"
import { fetchPin } from "../utils/apis"
import { CommentType } from "../types/types"




const PinPage = () => {
  const navigate=useNavigate()
  const {id}=useParams<{id:string}>()
  

  const {data,isPending,isError}=useQuery({
    queryKey:["pin",id],
    queryFn:()=>fetchPin(id as string),
    enabled:!!id
  })

  

  if(isPending){
    return <div>Loading...</div>
  }

  if(isError){
    return <div>Something went wrong!</div>
  }

  return (
    <div className="w-full md:max-w-3xl mx-auto">
     <div className="bg-white rounded-lg shadow-lg flex md:h-[600px] flex-col md:flex-row">
       {/* left section */}
       <div className="md:w-[2/3] rounded-lg h-full w-full">
        <img src={data?.image} alt="img" className="w-full h-full object-cover rounded-lg md:rounded-l-lg" />
       </div>

       {/* right section */}
       <div className="w-full h-full md:w-[1/3] p-4 flex flex-col justify-between ">
        <div>
          <div className="w-full flex items-center justify-between">
             <div onClick={()=>navigate(`/user/${data?.userId}`)} className="cursor-pointer flex items-center gap-2">
              {data?.user?.image ? <img src={data?.user?.image} alt="img" className="w-8 h-8 rounded-full"/> : <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-sm">
                 {data?.user?.name.charAt(0)}
              </div>}
              <span className="text-sm font-semibold">{data?.user?.username}</span>
             </div>
             <button className="bg-red-500 text-white px-4 py-1 rounded-full text-sm">Save</button>
          </div>

          <h1 className="text-xl font-bold my-3">{data?.title}</h1>
          <p className="text-sm text-gray-600 mb-4">{data?.description}</p>
          <button onClick={()=>window.open(data?.link)} className="bg-gray-200 text-sm text-gray-700  rounded-full py-1 mb-4 w-full">Visit Site</button>
          <div className="border-t pt-4">
           <h2 className="font-semibold mb-2">Comments</h2>
           <div className="space-y-2 mb-4 overflow-y-scroll md:h-[280px] h-[300px]">
             {data?.comments.map((comment:CommentType,index:number)=>(
              <div key={index} className="text-sm text-gray-700 bg-gray-100 p-2 rounded-md">
                 {comment.comment}
              </div>
             ))}
           </div>
          </div>
        </div>
        <CommentForm data={data} id={id!}/>
       </div>
     </div>
    </div>
  )
}

export default PinPage