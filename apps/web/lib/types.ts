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