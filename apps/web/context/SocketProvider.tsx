"use client";
import React, { useCallback, useEffect ,useContext} from "react";

interface SocketProviderProp {
  children?: React.ReactNode;
}

interface ISocketContext {
  SendMessage: (msg: string) => void;
}

export const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = ()=> { 
  const state = useContext(SocketContext);
  if(!state) throw new Error("Socket state is not avaiable");
  return state;
}

export const SocketProvider: React.FC<SocketProviderProp> = ({ children }) => {
  const SendMessage: ISocketContext['SendMessage'] = useCallback((msg: string) => {
    console.log("Received msg:", msg)
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000');
    console.log("conection state", ws.readyState);
    ws.onopen = (event => {
      console.log("Message sent", ws.url);
      ws.send("Hello from server");
    });
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