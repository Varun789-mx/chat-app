import { Delete, Send } from "lucide-react";
import { usertype } from "../../lib/types";
import { useChatStore } from "../../lib/useChatStore";
import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketProvider";

export function ChatBox() {
  const Chats = useChatStore((state) => state.chats);
  const UserName = useChatStore((state) => state.UserName);
  const RoomId = useChatStore((state) => state.roomId);
  const setChats = useChatStore((state) => state.setChats);
  const reset = useChatStore((state) => state.reset);
  const [msg, setmsg] = useState("");
  const socket = useSocket();

  useEffect(() => {
    const sm = socket.servermsg;
    if (!sm) return;
    if (sm.username === UserName) {
      return;
    }

    if (sm?.type === usertype.Server) {
      setChats(sm);
    }
    console.log(sm, "Current chats");
    console.log(socket.servermsg, "Server msg current");
  }, [socket.servermsg]);

  const HandleMsg = () => {
    const usermsg = {
      id: crypto.randomUUID(),
      username: UserName,
      type: usertype.User,
      roomId: RoomId,
      message: msg,
      timeStamp: new Date(),
    };
    console.log(usermsg, "from HandleMsg");
    socket.SendMessage(usermsg);
    console.log(Chats, "From chatbox");
    setmsg("");
    setChats(usermsg);
  };

  const HandleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && msg !== "") {
      e.preventDefault();
      HandleMsg();
      setmsg("");
    }
  };
  return (
    <div className="h-screen flex p-5 justify-center bg-[#11001c]">
      <div className="w-125 h-[760px] bg-[#290025] p-4 rounded-2xl shadow-2xl flex flex-col border border-[#4F0147] ">
        <div className="flex justify-around ">
          <div className="flex flex-col justify-start">
            <h1>Room:{RoomId}</h1>
            <p className="text-sm text-gray-400">Logged in as {UserName}</p>
          </div>
          <div>
            <button onClick={reset} className="bg-red-500 p-2 w-25 rounded-lg">
              Leave
            </button>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#35012C]">
          {Chats.map((chat, index) => (
            <div
              key={index}
              className={`max-w-[75%] p-3 rounded-xl text-sm ${chat.username === UserName ? "ml-auto bg-[#3A015C]  text-white rounded-br-md" : "bg-[#11001C] text-gray-200 border border-[#4F0147] rounded-bl-md"}`}
            >
              <strong className="block text-xs mb-1 opacity-70 ">
                {chat.username}
              </strong>
              {chat.message}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-[#4F0147] flex gap-2 bg-[#290025]">
          <input
            type="message"
            name="message"
            value={msg}
            onChange={(e) => setmsg(e.target.value)}
            onKeyDown={HandleKeypress}
            className="flex-1 p-3 rounded-xl bg-[#11001C] border border-[#4F0147] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A015C]"
          />
          <button
            onClick={HandleMsg}
            className="bg-[#3A015C] text-white px-4 relative rounded-xl hover:bg-[#4F0147] transition"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}
