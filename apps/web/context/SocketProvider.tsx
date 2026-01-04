"use client";
import React, { useCallback, useEffect, useContext, useRef, useState } from "react";


interface SocketProviderProp {
  children?: React.ReactNode;
}

interface ISocketContext {
  SendMessage: (msg: string) => void;
  servermsg: string[];
}

export const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("Socket state is not avaiable");
  return state;
}

export const SocketProvider: React.FC<SocketProviderProp> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [servermsg, setservermsg] = useState<string[]>([]);
  const SendMessage: ISocketContext['SendMessage'] = useCallback((msg: string) => {
    console.log(msg, "Message from client")
    if (socketRef && socketRef.current?.readyState === 1) {
      socketRef.current.send(msg);
    }
  }, []);


  const onMessageRcd = useCallback((msg: string) => {
    console.log("Message Rcd from server", msg);
    const { message } = JSON.parse(msg) 
    console.log(message,"parse");
    setservermsg(prev => [...prev, message]);
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket('ws://localhost:8000');
      socketRef.current.onopen = () => {
        console.log('Web socket connected');
      }
    }
    socketRef.current.onmessage = (event) => {
      onMessageRcd(event.data);
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