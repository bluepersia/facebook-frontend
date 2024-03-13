import { IImage } from "./image";
import { ILikeable } from "./likeable";
import { IUser } from "./user";

export interface IPost  extends ILikeable
{
    user: IUser,
    text:string,
    images:IImage[],
    createdAt:Date,
    isPost:boolean
}

