import { useQuery } from "@tanstack/react-query"
import Pin from "./Pin"
import { fetchPins } from "../utils/apis"
import { PinType } from "../types/types"


const Gallery = ({search}:{search:string}) => {
  
  const {data,isPending,isError}=useQuery({
    queryKey:['pins',search],
    queryFn:()=>fetchPins(search)
  })

  if(isPending){
    return <div>Loaing....</div>
  }
  if(isError){
    return <div>Something went wrong...</div>
  }

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-4 p-4">
        {data?.map((pin:PinType,index:number)=>(
            <Pin data={pin} index={index}/>
        ))}
    </div>
  )
}

export default Gallery