"use client"

import { useEffect, useState } from "react";

export function useClient(){

    const [isClient,setIsClinet] = useState(false)

    useEffect(() => {
        
        setIsClinet(true)
    },[])

    return isClient;
}