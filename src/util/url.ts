export const baseUrl = `http://127.0.0.1:3000`;
export const apiUrl = baseUrl + `/api/v1`;
export const imgUrl = baseUrl + '/img';


export function getUserImage (name:string) : string 
{
    return `${imgUrl}/user/${name}`;
}

export function getPostImage (name:string, size:string) : string 
{
    return `${imgUrl}/post/${name}`.replace ('<SIZE>', size);
}