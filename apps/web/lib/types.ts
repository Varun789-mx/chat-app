export enum usertype {
  User = "USER",
  Server = "SERVER"
}
export interface Messages {
  id: number;
  type: usertype
  message: string;
  timeStamp: Date;
}

export type Chats = Messages[];

export interface SocketProviderProp {
  children?: React.ReactNode;
}

export interface ISocketContext {
  SendMessage: (msg: string) => void;
  servermsg: string[];
}