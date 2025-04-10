export type PinType={
    id:string,
    title:string,
    description:string,
    image:string,
    userId:string,
    link:string,
    user?:UserType
}

export type CommentType={
    id:string,
    comment:string,
    userId:string,
    pinId:string,
}

export type UserType={
    id:string,
    name:string,
    username:string,
    image?:string,
    email:string,
}