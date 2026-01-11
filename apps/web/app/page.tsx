"use client"
import { ArrowLeft, CircleUser, EllipsisVertical, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react"
import { useSocket } from "../context/SocketProvider";
import { Chats, MsgObj, usertype } from "../lib/types";
import { log } from "console";
import { serialize } from "v8";

export default function Page() {
  const socket = useSocket();
  const [chats, setchats] = useState<Chats>([]);
  const [msg, setmsg] = useState("");
  const [UserData, setUserData] = useState({
    roomId: "",
    userName: "",
  });

  const HandleMsg = () => {
    const usermsg = {
      id: crypto.randomUUID(),
      username: UserData.userName,
      type: usertype.User,
      roomId: UserData.roomId,
      message: msg,
      timeStamp: new Date,
    }
    console.log(usermsg, "from HandleMsg");
    socket.SendMessage(usermsg);
    setchats(prev => [...prev, usermsg]);
  }
  useEffect(() => {
    if (!UserData.roomId && !UserData.userName) {
      const localdata = JSON.parse(localStorage.getItem("UserData") || "{}");
      setUserData(localdata);
      if (!localdata) {
        console.log("Current User data not available", localdata);
      }
      console.log(localdata);
    }
  }, [])
  useEffect(() => {
    const sm = socket.servermsg;
    if (!sm) return;
    if (sm.username === UserData.userName) {
      return;
    }

    if (sm?.type === usertype.Server) {
      setchats(prev => [...prev, sm]);
    }
    console.log(chats, "Current chats");
    console.log(socket.servermsg, "Server msg current");
  }, [socket.servermsg])
  return (
    <div className="w-full bg-black flex justify-center h-screen">
      <div className="flex flex-col p-4 gap-4 justify-center bg-gray-800 ">

        <input type="text"
          placeholder="Enter you User Name"
          onChange={e => setUserData({ ...UserData, userName: e.target.value })}
          className="border border-blue-500 p-3 rounded-xl" />

        <input type="text"
          onChange={(e) => setUserData({ ...UserData, roomId: e.target.value })}
          placeholder="enter your room id"
          className="border border-blue-500 p-3 pl-4 placeholder:text-sm rounded-xl" />

        <button type="button" onClick={() => {
          localStorage.setItem("UserData", JSON.stringify(UserData));
        }} className="bg-blue-500 rounded-xl p-4 text-md" >Submit</button>
      </div>
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
            <div key={msg.id} className={`flex px-3 py-4 p-5 gap-5  ${msg.type === usertype.Server ? "justify-end" : "justify-start"} `}
            >
              <p className=" p-10  bg-gray-800 border border-gray-700 w-fit h-auto text-2xl rounded-xl" >{msg.message}</p>
            </div>
          ))}

        </div>
        <div className="flex justify-center p-5 m-5">
          <input type="text" placeholder="Enter you text" onChange={e => setmsg(e.target.value)} className="bg-gray-800 w-2/3 h-10 rounded-2xl" />
          <button onClick={HandleMsg}><Send />
          </button>
        </div>
      </div>
    </div>
  )
}