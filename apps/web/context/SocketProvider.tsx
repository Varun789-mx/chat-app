"use client";
import React, { useCallback, useEffect, useContext, useRef } from "react";


interface SocketProviderProp {
  children?: React.ReactNode;
}

interface ISocketContext {
  SendMessage: (msg: string) => void;
}

export const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("Socket state is not avaiable");
  return state;
}

export const SocketProvider: React.FC<SocketProviderProp> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const SendMessage: ISocketContext['SendMessage'] = useCallback((msg: string) => {
    console.log(msg, "Message from client")
    if (socketRef && socketRef.current?.readyState === 1) {
      console.log(socketRef);
      console.log(socketRef.current.readyState);
      socketRef.current.send(msg);
    }
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket('ws://localhost:8000');
      socketRef.current.onopen = () => {
        console.log('Web socket connected');
      }
    }

    return () => {
      socketRef.current?.close();
    }
  }, [])
  return (
    <SocketContext.Provider value={{ SendMessage }}>
      {children}
    </SocketContext.Provider>
  )
} 