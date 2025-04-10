import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PinType } from "../types/types"
import { postComment } from "../utils/apis"

const commentSchema=z.object({
    comment:z.string().min(1,"Comment can not be empty!"),
})

type CommentFormValues=z.infer<typeof commentSchema> 

const CommentForm = ({data,id}:{data:PinType,id:string}) => {
    const {register,handleSubmit,reset,formState:{errors}}=useForm<CommentFormValues>({
            resolver:zodResolver(commentSchema)
        })
        const queryClient=useQueryClient()
    
        const {mutate,error}=useMutation({
          mutationFn:(comment:string)=>postComment(comment,id,data?.user?.id as string),
          onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["pin",id]})
            reset()

          }
        })
         
        if(error){
          alert("Something went wrong!")
        }

        const onSubmit=(data:CommentFormValues)=>{
            // console.log(data.comment)
            if(data.comment.trim()===''){
              return ;
            }
            mutate(data.comment)

        }
  return (
    <div className="border-t pt-4 w-full">
     <form onSubmit={handleSubmit(onSubmit)} className="flex w-full items-center gap-2">
      <div className="w-full">
        <input 
        type="text"
        placeholder="Add a comment"
        className="border rounded-full px-3 py-1 w-full text-sm"
        {...register("comment")}
        />
        {errors.comment && <p className="text-xs text-red-500">{errors.comment.message}</p>}
      </div>
      <button type='submit' className="bg-red-500 text-white py-1 px-3 cursor-pointer rounded-full text-sm">Post</button>
     </form>
    </div>
  )
}

export default CommentForm