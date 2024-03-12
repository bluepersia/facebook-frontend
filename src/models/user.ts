export interface IUser
{
    firstName:string,
    lastName:string,
    email:string,
    role:string,
    imageProfile:string,
    imageCover:string
}

export function getFullName (user:IUser) : string 
{
    return user.firstName + ' ' + user.lastName;
}