import { IImage } from "./image";
import { IUser } from "./user";

export interface IPost 
{
    user: IUser,
    text:string,
    images:IImage[],
    createdAt:Date
}