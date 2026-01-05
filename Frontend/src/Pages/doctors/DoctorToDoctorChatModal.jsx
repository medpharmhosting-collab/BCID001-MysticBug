// DoctorToDoctorChatModal.jsx
import { useEffect, useState, useRef } from "react";
import { icons } from "../../assets/assets";
import { useAuth } from "../../Context/AuthContext";
import Loader from "../admin/Loader";
import { BASE_URL } from "../../config/config.js";

const POLL_MS = 3000;

const DoctorToDoctorChatModal = ({ doctor, onClose }) => {
  const { uid } = useAuth(); // current doctor
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);
  const messagesEndRef = useRef(null);

  const otherUid = doctor.uid;

  const fetchMessages = async (signal) => {
    if (!uid || !otherUid) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/messages/doctor-messages/${uid}/${otherUid}`, { signal });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      if (err.name !== "AbortError") console.error("Error loading messages:", err);
      setMessages(prev => prev);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchMessages(controller.signal);
    pollRef.current = setInterval(() => fetchMessages(new AbortController().signal), POLL_MS);
    return () => {
      controller.abort();
      clearInterval(pollRef.current);
    };
  }, [uid, otherUid]);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/messages/doctor-send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: uid,
          receiverId: otherUid,
          message: newMessage.trim()
        })
      });
      if (!res.ok) throw new Error("Failed to send");
      const sent = await res.json();
      setMessages(prev => [...prev, sent]);
      setNewMessage("");
      // immediate refresh (optional)
      const refreshRes = await fetch(`${BASE_URL}/messages/doctor-messages/${uid}/${otherUid}`);
      if (refreshRes.ok) {
        const refreshed = await refreshRes.json();
        setMessages(refreshed || []);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#f3e8d1] rounded-lg w-full max-w-4xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-[#004d4d] p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-xl">
              {doctor.name?.charAt(0)?.toUpperCase() || "D"}
            </div>
            <div className="text-white">
              <h2 className="font-bold text-xl">{doctor.name}</h2>
              <p className="font-medium text-md">doctor</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 p-2 rounded-full text-white hover:text-gray-200 text-3xl font-light">
            <icons.MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? <p className="text-center text-[#004d4d] py-8"><Loader /></p> : null}
          {!loading && messages.length === 0 && <p className="text-center text-[#004d4d] py-8">No messages yet. Start the conversation!</p>}
          {messages.map(msg => {
            const isSender = msg.senderId === uid;
            return (
              <div key={msg._id || msg.createdAt} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${isSender ? "bg-[#004d4d] text-white" : "bg-[#f6e2ac] text-[#004d4d]"}`}>
                  <p className="text-sm break-words">{msg.message}</p>
                  <p className={`text-xs mt-1 ${isSender ? "text-gray-300" : "text-gray-600"}`}>
                    {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#004d4d]/20">
          <div className="flex items-center gap-2 bg-white rounded-lg p-2">
            <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 outline-none px-2" />
            <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="bg-[#004d4d] text-white p-2 rounded-lg hover:bg-[#006666] disabled:opacity-50 disabled:cursor-not-allowed">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorToDoctorChatModal;
