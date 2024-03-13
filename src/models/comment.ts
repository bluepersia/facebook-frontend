import { ILikeable } from "./likeable";
import { IUser } from "./user";

export interface IComment extends ILikeable
{
    user:IUser,
    post:string,
    image:string,
    comment:string,
    text:string,
    level:number,
    likes:number
}

