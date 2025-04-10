import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuthStore } from "../store/AuthStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPin } from "../utils/apis"
import { useNavigate } from "react-router"


const pinSchema=z.object({
    title:z.string().min(3,"Title must be at least 3 characters"),
    description:z.string().min(10,"Description must be at least 10 characters"),
    link:z.string().optional(),
    image:z.any()
})

type PinFormValues=z.infer<typeof pinSchema> 


const CreatePinPage = () => {
    const [imagePreview,setImagePreview]=useState<string | null>(null);

    const queryClient=useQueryClient()
    const navigate=useNavigate()
    const {currentUser}=useAuthStore()

    const {register,handleSubmit,setValue,formState:{errors}}=useForm<PinFormValues>({
        resolver:zodResolver(pinSchema)
    })


    const {mutate}=useMutation({
      mutationFn:async(formData:FormData)=>{
        return createPin(formData)
      },
      onSuccess:()=>{
         queryClient.invalidateQueries({queryKey:["pins"]})
         navigate("/")
      },
      onError:()=>{
        alert("An error occurred while creating the pin")
      }
    })

    const onSubmit=(data:PinFormValues)=>{
        const formData=new FormData()
        formData.append("title",data.title)
        formData.append("description",data.description)
        formData.append("link",data.link || "")
        formData.append("file",data.image)
        if(currentUser){
            formData.append("userId",currentUser.id)
        }
        else{
          return ;
        }

        mutate(formData)
    }


    const handleImageUpload=(event:React.ChangeEvent<HTMLInputElement>)=>{
       const file=event.target.files?.[0]
       if(file){
        setImagePreview(URL.createObjectURL(file))
        setValue("image",file)
       }
    }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Pin</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* image upload card */}
        <div className="flex flex-col items-center border border-dashed border-gray-300 rounded-lg p-6 w-full">
            {imagePreview ? (<img src={imagePreview} alt="preview" className="w-full rounded-md"/>) 
            : 
            (<label className="cursor-pointer flex flex-col items-center justify-center h-64 w-full text-gray-500">
            <span className="text-lg">Choose a file or drag and drop it here</span>
            <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            />
            </label>)}
        </div>

        {/* form fields */}
        <div  className="flex flex-col space-y-4">
          {/* title */}
          <div>
            <input 
            type="text"
            placeholder="Add a title"
            {...register("title")}
            className="w-full p-2 border rounded-md text-lg"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p> }
          </div>

          {/* description */}
          <div>
            <textarea 
            
            placeholder="Add a description"
            {...register("description")}
            className="w-full p-2 border rounded-md text-lg h-64 resize-none"
            />
             {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p> }
          </div>

         {/* link */}
         <div>
            <input 
            type="text"
            placeholder="Add a link"
            {...register("link")}
            className="w-full p-2 border rounded-md text-lg"
            />
             {errors.link && <p className="text-red-500 text-sm">{errors.link.message}</p> }
          </div>

          <button type="submit" className="w-full bg-red-500 text-white py-2 rounded-md text-lg hover:bg-red-600 cursor-pointer">Publish</button>

        </div>

      </form>
    </div>
  )
}

export default CreatePinPage