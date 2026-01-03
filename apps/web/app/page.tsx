"use client"
import { ArrowLeft, CircleUser, EllipsisVertical, Phone } from "lucide-react";
import { useEffect, useState } from "react"

interface Messages {
  id: number;
  message: string;
  timeStamp: Date;
}
const testChats = [{
  id: 1,
  message: "Hi good morning",
  timeStamp: new Date,
}, {
  id: 2,
  message: " good morning",
  timeStamp: new Date,
}, {
  id: 3,
  message: "How are you",
  timeStamp: new Date,
}, {
  id: 4,
  message: "I'm good what about you",
  timeStamp: new Date,
}]
export type Chats = Messages[];
export default function Page() {
  const [chats, setchats] = useState<Chats>([]);

  useEffect(() => {
    setchats(testChats);
  }, [])
  return (
    <div className="w-full bg-black flex justify-center h-screen">
      <div className="w-2/4 md:w-2/4 flex justify-center flex-col bg-gray-800 shadow-xl">


        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800 bg-gray-950">
          <div className="flex gap-4 items-center">
            <ArrowLeft />
            <CircleUser className="w-10 h-10 cursor-pointer" />
            <p className="text-lg font-semibold">Nishant Chahar</p>
          </div>
          <div className="flex gap-4 items-center">
            <Phone className="w-8 h-8" />
            <EllipsisVertical />
          </div>
        </div>
        <div
          className="bg-[url('https://w0.peakpx.com/wallpaper/1002/489/HD-wallpaper-doodle-art-game-controller-art.jpg')] flex-1 bg-cover bg-center w-full ">

          {chats && chats.map((msg) => (
            <div className={`inline-flex max-w-[70%] px-4 py-3 gap-5  ${msg.id % 2 == 0 ? "justify-end" : "justify-start"} `}
              key={msg.id}>
              <p className=" p-10  bg-gray-800 border border-gray-700 w-fit h-auto text-2xl rounded-xl" >{msg.message}</p>
              {/* <p>{msg.timeStamp.toString()}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}