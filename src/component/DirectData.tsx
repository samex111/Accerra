import { useEffect, useState } from "react";

interface Data{
    directData:any;
}
export default function DirectData(directData:Data){
  const [messages, setMessages]=  useState([]);
  useEffect(()=>{
    // @ts-ignore
     setMessages((pre)=> [...pre,directData])
  },[directData])

  return (
    <>
    <h1>Response</h1>
    <p>{messages}</p>
    </>
  )
}