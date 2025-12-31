"use client";
import React, { useCallback, useEffect } from "react";

interface SocketProviderProp {
  children?: React.ReactNode;
}

interface ISocketContext {
  SendMessage: (msg: string) => void;
}

export const SocketContext = React.createContext<ISocketContext | null>(null);


export const SocketProvider: React.FC<SocketProviderProp> = ({ children }) => {
  const SendMessage: ISocketContext['SendMessage'] = useCallback((msg: string) => {
    console.log("Received msg:", msg)
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000');
    console.log("connected to the server")
    return () => {
      ws.close();
    }
  }, [])
  return (
    <SocketContext.Provider value={{ SendMessage }}>
      {children}
    </SocketContext.Provider>
  )
} 