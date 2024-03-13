import { ILikeable } from "./likeable";

export interface IImage extends ILikeable
{
    post:string,
    album:string,
    url:string,
    createdAt:Date,
    isImage:boolean
}

