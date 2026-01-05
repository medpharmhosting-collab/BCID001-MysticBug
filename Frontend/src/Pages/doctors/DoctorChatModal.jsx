// DoctorChatModal.jsx
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import Loader from "../admin/Loader";
import { icons } from "../../assets/assets";
import { BASE_URL } from "../../config/config.js";

const POLL_MS = 3000;

const DoctorChatModal = ({ patient, onClose }) => {
  const { uid: doctorUid, userName } = useAuth();
  const patientId = patient.patientId;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const fetchConversation = async (signal) => {
    if (!doctorUid || !patientId) return;
    try {
      const res = await fetch(`${BASE_URL}/messages/conversation/${doctorUid}/${patientId}`, { signal });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      if (err.name !== "AbortError") console.error("Conversation load error:", err);
      setMessages(prev => prev);
    } finally {
      setLoading(false);
    }

    // mark read (best-effort)
    try {
      await fetch(`${BASE_URL}/messages/mark-read/${patientId}/${doctorUid}`, { method: "PATCH" });
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchConversation(controller.signal);
    pollRef.current = setInterval(() => fetchConversation(new AbortController().signal), POLL_MS);
    return () => {
      controller.abort();
      clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorUid, patientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;
    const payload = {
      senderId: doctorUid,
      senderName: userName || "Doctor",
      senderRole: "doctor",
      receiverId: patientId,
      receiverName: patient.patientName || "Patient",
      receiverRole: "patient",
      message: newMessage.trim()
    };
    try {
      const res = await fetch(`${BASE_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to send");
      const sent = await res.json();
      setMessages(prev => [...prev, sent]);
      setNewMessage("");
      scrollToBottom();
    } catch (err) {
      console.error("Send message error:", err);
      // optionally show alert
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />

      <div className="fixed inset-0 z-[100] bg-black/50  flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col overflow-hidden">
          <div className="bg-[#1a7f7f] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-xl">
                {patient.patientName?.charAt(0)?.toUpperCase() || "P"}
              </div>
              <div>
                <h2 className="font-bold text-xl">{patient.patientName}</h2>
                <p className="font-medium text-sm">patient</p>
              </div>
            </div>

            <button onClick={onClose} className="w-10 h-10 p-2 rounded-full text-white hover:text-gray-200 text-3xl font-light">
              <icons.MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {loading ? (
              <div className="text-center py-12"><Loader /></div>
            ) : messages.length === 0 ? (
              <p className="text-center text-gray-500">No messages yet. Start the conversation.</p>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => {
                  const mine = msg.senderId === doctorUid;
                  return (
                    <div key={msg._id || msg.timestamp} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className="flex items-end gap-2 max-w-[70%]">
                        {/* {!mine && (
                          <div className="w-8 h-8 bg-[#1a7f7f] rounded-full flex items-center justify-center text-white text-sm">
                            {patient.patientName?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                        )} */}
                        <div className={`${mine ? "bg-[#1a7f7f] text-white" : "bg-white text-gray-800 shadow-md"} px-4 py-3 rounded-2xl`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${mine ? "text-green-100" : "text-gray-400"}`}>
                            {new Date(msg.timestamp || msg.createdAt || msg._doc?.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        {/* {mine && (
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">
                            {userName?.charAt(0)?.toUpperCase() || "D"}
                          </div>
                        )} */}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="flex p-4 gap-2 bg-white border-t">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-full outline-none"
              placeholder="Type a message..."
            />
            <button type="submit" disabled={!newMessage.trim()} className="px-6 py-3 bg-[#1a7f7f] text-white rounded-lg hover:bg-[#145f5f] disabled:bg-gray-300">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorChatModal;
