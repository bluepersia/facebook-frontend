import { ILikeable } from "./likeable";

export interface IImage extends ILikeable
{
    _id:string,
    post:string,
    album:string,
    url:string,
    createdAt:Date
}