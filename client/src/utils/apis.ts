
import { apiClient } from "./apiClient"

export const fetchPins=async(search:string)=>{
    try{
       const res=await apiClient.get(`/api/pins?search=${search}`)
       return res.data
    }
    catch(error){
        console.log(error)
    }
}

export const fetchPin=async(pinId:string)=>{
    try{
      const res=await apiClient.get(`/api/pins/${pinId}`)
      return res.data
    }
    catch(error){
        console.log(error)
    }
}

export const postComment=async(comment:string,pinId:string,userId:string)=>{
    try{
      const res=await apiClient.post(`/api/comments`,{comment,pinId,userId})
      return res.data
    }
    catch(error){
        console.log(error)
    }
}

export const createPin=async(formData:FormData)=>{
    try{
      const res=await apiClient.post(`/api/pins`,formData)
      return res.data
    }
    catch(error){
        console.log(error)
    }
}

export const fetchUser=async(userId:string)=>{
    try{
      const res=await apiClient.get(`/api/users/${userId}`)
      return res.data
    }
    catch(error){
        console.log(error)
    }
}

export const updateUserProfilePicture=async(userId:string,formData:FormData)=>{
    try{
      const res=await apiClient.put(`/api/users/${userId}`,formData)
      return res.data
    }
    catch(error){
        console.log(error)
    }
}