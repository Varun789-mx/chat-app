export enum usertype {
  User = "USER",
  Server = "SERVER"
}
export interface MsgObj {
  id: string,
  username: string,
  type: usertype,
  message: string,
  roomId: string,
  timeStamp: Date,
}
export type Chats = MsgObj[];

export interface SocketProviderProp {
  children?: React.ReactNode;
}

export interface ISocketContext {
  SendMessage: (msg: MsgObj) => void;
  servermsg: MsgObj | null;
}

export interface ChatProp {
  UserName: string,
  roomId: string;
  isLoading: boolean;
  chats: MsgObj[];

  setRoomId: (Id: string) => void;
  setChats: (chat: MsgObj) => void;
  setUserName: (username: string) => void;
}