"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [msg,setMsg]=useState('')
  useEffect(() => {
    const fetchMessage = async () => {
      const response = await fetch("/api/hello");
      const data = await response.json();
      console.log(data);
      setMsg(data.message)
    };

    fetchMessage();
  }, []);
  return <div>{msg}</div>;
}
