import { useEffect, useState } from "react";

enum State 
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

    useEffect (() =>
    {
        if (isLoading)
            setState (State.Pending);
    }, [isLoading]);

    useEffect (()=>
    {
        if (data)
            setState (State.Success);
    }, [data]);

    useEffect (() =>
    {
        if (error)
            setState (State.Fail);
    }, [error])
    async function refetch (url:string, opts:RequestInit) : Promise<void>
    {
        try 
        {
            setIsLoading (true);

            opts.credentials = "include";
            const res = await fetch (url, opts);

            if (!res.ok)
                throw new Error ((await res.json()).message);

            setData (await res.json());
        }
        catch (err)
        {
            setError (err as Error);
        }
        finally
        {
            setIsLoading (false);
        }
    }

    return {data, isLoading, error, state, refetch};
}