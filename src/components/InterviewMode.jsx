import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../api/sockets';
import { useRole } from '../context/RoleContext';

const InterviewMode = () => {
  const [role, setRole] = useState("Interviewer");
  const { setRole: setRoleContext } = useRole();
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to socket:", socket.id));

    socket.on("room-error", (msg) => {
      alert(msg);
    });

    // ✅ Navigate when "room-joined" is received
    socket.on("room-joined", ({ roomId }) => {
      console.log(`Navigating to interview room: ${roomId}`);
      navigate(`/interview/${roomId}`);
    });

    return () => {
      socket.off("room-error");
      socket.off("room-joined");
    };
  }, [navigate]);

  const handleSubmit = (e) => {
     e.preventDefault();
    console.log("button clicked");
    if (!roomId || !role) {
        alert("Please enter a Room ID and select a Role.");
        return;
    }
    
    setRoleContext(role);
    console.log(role);

    
    socket.emit("join-room", { roomId, role });
    
};
  return (
    <div className="min-h-screen flex justify-center items-center  bg-linear-to-bl from-black to-zinc-900">
      <form onSubmit={handleSubmit} className="bg-linear-to-r from-gray-300 via-gray-400 to-zinc-500 p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Join Interview</h2>
        
        <label className="block mb-2 text-sm font-medium">Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded mb-4">
          <option value="Interviewer">Interviewer</option>
          <option value="Interviewee">Interviewee</option>
        </select>

        <label className="block mb-2 text-sm font-medium">Enter Room ID:</label>
        <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="w-full p-2 border rounded mb-4" placeholder="Enter Room ID" />

        <button type="submit" className="w-full bg-zinc-700 text-white py-2 rounded hover:bg-pruple-600">
          Join
        </button>
      </form>
    </div>
  );
};

export default InterviewMode;
