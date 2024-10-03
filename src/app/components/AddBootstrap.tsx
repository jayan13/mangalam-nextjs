"use client";

import { useEffect } from "react";

export default function AddBootstrap()
{
   // useEffect(()=>{
    //    typeof document !== undefined   ? require('bootstrap/dist/js/bootstrap')   : null
    //},[])
    //return <></>
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
      }, []);
}