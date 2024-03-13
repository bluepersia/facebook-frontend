import { useEffect, useState } from "react";

export enum State 
{
    Idle,
    Pending,
    Success,
    Fail
}

export default function useFetch<TData> () 
{
    const [state, setState] = useState<State>(State.Idle);
    const [data, setData] = useState<TData>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error|null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [extra, setExtra] = useState<any> ();

 
    useEffect (() =>
    {
        if (error)  
            console.error (error);
    }, [error]);

   
    async function refetch (url:string, opts:RequestInit|undefined = undefined) : Promise<void>
    {
        try 
        {
            setIsLoading (true);
            setState (State.Pending);

            if (!opts) 
                opts = {};
            
            opts.credentials = "include";
            const res = await fetch (url, opts);

            if (!res.ok)
                throw new Error ((await res.json()).message);
            
            
            setData (res.status === 204 ? null : await res.json());

            setState (State.Success);
        }
        catch (err)
        {
            setError (err as Error);
            setState (State.Fail);
        }
        finally
        {
            setIsLoading (false);
        }
    }

    return {data, isLoading, error, state, refetch, extra, setExtra};
}