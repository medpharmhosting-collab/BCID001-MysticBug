import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import { BASE_URL } from "../../config/config.js"
import Loader from "../admin/Loader.jsx";

const PatientChat = ({ doctor, onClose }) => {
  const { uid, userName } = useAuth();
  ;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchDoctorfromId = async () => {
      try {
        const res = await fetch(`${BASE_URL}/doctors/get_doctor_by_id/${doctor._id}`)
        const data = await res.json();
        setDoctorId(data.doctorId);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
    fetchDoctorfromId()
  }, [BASE_URL, uid])


  // Fetch messages between patient and doctor
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/messages/conversation/${uid}/${doctorId}`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        // API returns { messages: [...] }
        const safeMessages = Array.isArray(data.messages) ? data.messages : [];
        setMessages(safeMessages);
        setLoading(false);

        // Mark messages from doctor as read
        if (safeMessages.length > 0) {
          try {
            //  Mark messages as read
            await fetch(`${BASE_URL}/messages/mark-read/${doctorId}/${uid}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
            });
          } catch (markReadError) {
            console.log("Could not mark messages as read:", markReadError);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
        setMessages([]);
      }
    };

    if (doctor._id && uid) {
      fetchMessages();

      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [doctorId, uid, BASE_URL]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: uid,
          senderName: userName,
          senderRole: "patient",
          receiverId: doctorId,
          receiverName: doctor.name,
          receiverRole: "doctor",
          message: newMessage,
        }),
      });

      if (res.ok) {
        const sentMessage = await res.json();
        setMessages((prev) => [...(prev || []), sentMessage]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] sm:h-[85vh] flex flex-col">
          {/* Chat Header */}
          <div className="bg-[#1a7f7f] text-white p-3 sm:p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className=" w-10 h-10 sm:w-12 sm:h-12 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-lg sm:text-xl">
                {doctor.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-lg sm:text-xl">Dr. {doctor.name}</h2>
                {doctor.specialization && (
                  <p className="text-xs sm:text-sm text-gray-200">{doctor.specialization}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 p-2 rounded-full flex justify-center items-center text-white hover:text-gray-200 transition text-2xl sm:text-3xl font-light"
            >
              ×
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {loading ? (
              <div className="text-center py-12">
                <Loader />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-base sm:text-lg">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderId === uid ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%] sm:max-w-[70%]">
                      {/* {msg.senderId !== uid && (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1a7f7f] rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                          {doctor.name?.charAt(0).toUpperCase()}
                        </div>
                      )} */}
                      <div
                        className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-sm sm:text-base ${msg.senderId === uid
                          ? "bg-[#1a7f7f] text-white"
                          : "bg-white text-gray-800 shadow-md"
                          }`}
                      >
                        <p className="text-xs sm:text-sm">{msg.message}</p>
                        <p
                          className={`text-[10px] sm:text-xs mt-1 ${msg.senderId === uid
                            ? "text-green-100"
                            : "text-gray-400"
                            }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {/* {msg.senderId === uid && (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                          {userName?.charAt(0).toUpperCase()}
                        </div>
                      )} */}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="bg-white p-4 border-t border-gray-200 rounded-b-2xl flex items-center  gap-2 sm:gap-3"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 rounded-full outline-none focus:border-[#1a7f7f] focus:ring-2 focus:ring-[#1a7f7f] focus:ring-opacity-20 text-sm sm:text-base transition"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-[#1a7f7f] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:bg-[#145f5f] disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-1 sm:gap-2"
            >
              <span>Send</span>
              <span className="text-lg sm:text-xl">→</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PatientChat;