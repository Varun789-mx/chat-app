import { useState, useEffect } from "react";

export function RoomBox() {
    const [UserData, setUserData] = useState({
        roomId: "",
        userName: "",
    });

    const HandleUserData = () => {
        if (!UserData.roomId && !UserData.userName) {
            const localdata = JSON.parse(localStorage.getItem("UserData") || "{}");
            setUserData(localdata);
            if (!localdata) {
                console.log("Current User data not available", localdata);
            }
            console.log(localdata);
        }
    }
    useEffect(() => {
        HandleUserData();
    }, [])
    return (
        <div className="h-screen flex justify-center items-center" style={{ background: "linear-gradient(135deg,#3A015C,#11001C)" }}>
            <div className="bg-[#290025] w-3/4 gap-3 flex flex-col items-center  md:w-1/3  p-5 rounded-2xl shadow-2xl  border border-[#4F0147]">
                <h1 className="font-semibold p-4 text-white text-2xl">Join Chat</h1>

                <input className="w-full p-3 mb-3 text-md rounded-xl bg-[#11001C] border border-[#4F0147] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A015C]" placeholder="Username" />

                <input className="w-full mb-3 p-3 text-md rounded-xl bg-[#11001C] border border-[#4F0147] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A015C]" placeholder="Room ID" />

                <button onClick={HandleUserData} className="w-full bg-[#3A015C] text-white py-3 rounded-xl hover:bg-[#4F0147] transition">
                    Join Room
                </button>
            </div>
        </div>
    )
}