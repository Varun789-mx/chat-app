"use client";
import React, { useCallback, useEffect, useContext, useRef, useState } from "react";
import { ISocketContext, MsgObj, SocketProviderProp, usertype } from "../lib/types";




export const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("Socket state is not avaiable");
  return state;
}

export const SocketProvider: React.FC<SocketProviderProp> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [servermsg, setservermsg] = useState<MsgObj | null>(null);
  const SendMessage: ISocketContext['SendMessage'] = useCallback((msgData: MsgObj) => {
    if (socketRef && socketRef.current?.readyState === 1) {
      console.log(msgData, "From send");
      socketRef.current.send(JSON.stringify(msgData));
    }
  }, []);


  const onMessageRcd = useCallback((msgObject: MsgObj) => {
    setservermsg(msgObject);
  }, []);

  useEffect(() => {
    const { roomId } = JSON.parse(localStorage.getItem("UserData") || "{}");
    console.log(roomId, "From function");
    if (!socketRef.current) {
      socketRef.current = new WebSocket(`ws://localhost:8000?room=${roomId}`);
      socketRef.current.onopen = () => {
        console.log('Web socket connected');
      }
    }
    socketRef.current.onmessage = function (event) {
      console.log(event, "event data")
      const { message } = JSON.parse(event.data);
      onMessageRcd(message);
    }

    return () => {
      socketRef.current?.close();
    }
  }, [])
  return (
    <SocketContext.Provider value={{ SendMessage, servermsg }}>
      {children}
    </SocketContext.Provider>
  )
} 