export function RoomBox() {
    return (
        <div className="h-screen flex justify-center items-center" style={{ background: "linear-gradient(135deg,#3A015C,#11001C)" }}>
            <div className="bg-[#290025] w-full flex flex-col items-center  md:w-1/3  p-8 rounded-2xl shadow-2xl  border border-[#4F0147]">
                <h1 className="font-semibold p-6 text-2xl">Join Chat</h1>

                <input className="w-full p-5 mb-3 rounded-xl bg-[#11001C] border border-[#4F0147] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A015C]" placeholder="Enter your username" />

                <input className="w-full mb-3 p-4 rounded-xl bg-[#11001C] border border-[#4F0147] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A015C]" placeholder="Enter Room Id" />

                <button className="w-full bg-[#3A015C] text-white py-3 rounded-xl hover:bg-[#4F0147] transition">
                    Join Room
                </button>
            </div>
        </div>
    )
}