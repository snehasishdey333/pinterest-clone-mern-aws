import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Pin from "../components/Pin"
import { fetchUser, updateUserProfilePicture } from "../utils/apis"
import { useAuthStore } from "../store/AuthStore"
import React, { useRef, useState } from "react"


const ProfilePage = () => {

  const [isUploading,setIsUploading]=useState(false)
  const fileInutRef=useRef<HTMLInputElement | null>(null)
  const {currentUser,updateCurrentUser}=useAuthStore()
  const queryClient=useQueryClient()
  const {data,isPending,isError}=useQuery({
    queryKey:['profile',currentUser?.id],
    queryFn:()=>fetchUser(currentUser?.id!),
    enabled:!!currentUser?.id
  })

  const uploadMutation=useMutation({
    mutationFn:async(formData:FormData)=>{
      return updateUserProfilePicture(currentUser?.id!,formData)
    },
    onSuccess:(data)=>{
      if(currentUser){
        updateCurrentUser({...currentUser,image:data.image})
      }
      queryClient.invalidateQueries({queryKey:['profile',currentUser?.id]})
    },
    onError:(error)=>{
      console.log(error)
      alert("There was an error uploading the image")
    }
  })

  const handleFileChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files && e.target.files.length > 0){
      const file=e.target.files[0]
      handleImageUpload(file)
    }
  }

  const handleImageUpload=async(file:File)=>{
    if(!file) {
      alert("Please select a file")
      return ;
    }
    setIsUploading(true)
    try{
       const formData=new FormData()
        formData.append('file',file)
        await uploadMutation.mutateAsync(formData)
        setIsUploading(false)
    }
    catch(error){
      console.log(error)
      alert("There was an error uploading the image")
    }

  }

  const handleImageClick=()=>{
    if(fileInutRef.current){
      fileInutRef.current.click()
    }
  }
  

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
        <div className="relative">
       {isUploading ?
       (<div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div> 
       </div>)
       :
       currentUser?.image ? (
        <button onClick={handleImageClick} className="relative group" disabled={isUploading}>
       <img src={currentUser?.image} alt="img" className="w-20 h-20 rounded-full"/>
       <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <span className="text-white text-xs">Change</span>
       </div>
       </button>)
        : 
       (
       <button onClick={handleImageClick} className="relative group" disabled={isUploading}>
       <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold">
         {currentUser?.name?.charAt(0)}
       </div>
       <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <span className="text-white text-xs">Upload</span>
       </div>
       </button>
       )}
       </div>

       {/* hidden input for file upload */}
       <input type="file" accept="image/*" ref={fileInutRef} className="hidden" onChange={handleFileChange}/>

       <h1 className="text-2xl font-semibold mt-2">{currentUser?.name}</h1>
       <p className="text-gray-600">{currentUser?.username}</p>
       <p className="text-gray-500 mt-1"> 202 followers - 20 following</p>
       <div className="mt-4 space-x-2">
        <button className="bg-gray-200 px-4 py-2 rounded-lg cursor-pointer">Message</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer">Follow</button>
       </div>
      </div>

      {/* uploaded images */}
      <div className="mt-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Uploaded Pins</h2>
      {data.pins.length > 0 ? (<div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-4 p-4">
        {data.pins.map((pin:any,index:number)=>(
            <Pin data={pin} index={index}/>
        ))}
    </div>) : 
    (<p className="text-sm">No uploaded pins</p>)}
      </div>
    </div>
  )
}

export default ProfilePage