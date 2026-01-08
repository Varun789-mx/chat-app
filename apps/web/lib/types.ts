export enum usertype {
  User = "USER",
  Server = "SERVER"
}
export interface MsgObj { 
  id:string,
  username:string,
  type:usertype,
  message:string,
  roomId:string,
  timeStamp:Date,
}
export type Chats = MsgObj[];

export interface SocketProviderProp {
  children?: React.ReactNode;
}

export interface ISocketContext {
  SendMessage: (msg: MsgObj) => void;
  servermsg: string[];
}