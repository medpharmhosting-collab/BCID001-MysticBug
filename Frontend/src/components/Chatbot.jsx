import { useState, useEffect, useRef } from "react";
import { default_page_images } from "../assets/assets";
import { BASE_URL } from "../config/config";

const ChatBot = () => {
  const [botPopup, setBotPopup] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFaqsLoading, setIsFaqsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const closed = localStorage.getItem("botClosed");
    if (!closed) setBotPopup(true);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchFaqs = async () => {
      setIsFaqsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/faqs`);
        const data = await res.json();
        setFaqs(data.message || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setIsFaqsLoading(false);
      }
    };

    if (botPopup) {
      fetchFaqs();
      setMessages([
        {
          type: "bot",
          text: "👋 Hello! How can I help you? Please select a question below:",
          timestamp: new Date(),
        },
      ]);
    }
  }, [botPopup]);

  const handleQuestionClick = async (id, question) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", text: question, timestamp: new Date() },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/faqs/${id}`);
      const data = await response.json();

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: data.message.answer, timestamp: new Date() },
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, I couldn't fetch the answer. Please try again.",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem("botClosed", "1");
    setBotPopup(false);
    setMessages([]);
  };

  return (
    <>
      {!botPopup && (
        <button
          onClick={() => {
            localStorage.removeItem("botClosed");
            setBotPopup(true);
          }}
          className="fixed top-[520px] right-4 sm:bottom-6 sm:right-6 w-20 h-20 sm:w-28 sm:h-28 rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 bg-transparent"
        >
          <img src={default_page_images.bot} alt="" />
        </button>
      )}

      {botPopup && (
        <div className=" fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-96 h-[100dvh] sm:h-[600px] bg-white rounded-t-2xl sm:rounded-2xl  shadow-2xl flex flex-col z-[150] border border-gray-200">
          <div className="bg-green-900 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img src={default_page_images.rounded_bot} alt="" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Support Bot</h3>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              X
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.type === "user"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-800 shadow-sm border border-gray-200"
                    }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-400"
                      }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <p className="text-xs text-gray-500 mb-3 font-medium">
              Frequently Asked Questions:
            </p>
            <div className="space-y-2 max-h-40 sm:max-h-32 overflow-y-auto">
              {isFaqsLoading ? (
                <div className="text-center py-4">
                  <div className="inline-block w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-gray-500 mt-2">Loading questions...</p>
                </div>
              ) : faqs.length > 0 ? (
                faqs.map((faq) => (
                  <button
                    key={faq._id}
                    onClick={() => handleQuestionClick(faq._id, faq.question)}
                    disabled={isLoading}
                    className="w-full text-left p-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-sm text-gray-700 transition-all duration-200 border border-blue-200 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {faq.question}
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-2">No questions available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
