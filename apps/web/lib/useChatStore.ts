import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ChatProp, MsgObj } from "./types";

export const useChatStore = create<ChatProp>()(
  devtools(
    persist(
      (set, get) => ({
        UserName: "",
        chats: [],
        roomId: "",
        isLoading: false,

        setRoomId: (Id: string) => {
          set({ roomId: Id });
          localStorage.setItem("RoomId", Id);
        },
        setUserName: (username: string) => {
          set({ UserName: username });
          localStorage.setItem("UserName", username);
        },
        setChats: (chat: MsgObj) => {
          set((state) => ({
            chats: [...state.chats, chat],
          }));
        },
        reset: () => {
        set({roomId:"",
          chats:[],
          UserName:"",
          isLoading:false,
        });
        localStorage.removeItem("Chat-store");
        localStorage.removeItem("RoomId");
        localStorage.removeItem("UserName");
        },
      }),
      { name: "Chat-store" }
    )
  )
);
