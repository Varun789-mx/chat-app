"use client"

interface Messages {
  id: string;
  message: string;
  timestamp: Date;
}
export type Chats = Messages[];
export default function Page() {
  return (
    <div className="w-full bg-blue-500 text-blue-400">
Hello world
    </div>
  )
}