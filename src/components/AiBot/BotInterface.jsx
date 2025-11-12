import React, { useContext, useEffect, useRef, useState } from "react";
import ChatbotIcon from "../../assets/chatbot";
import Message from "./Message";
import { InitialPrompt } from "../../assets/chatbot";
import { FIREWORKS_KEY, FIREWORKS_MODEL } from "../../assets/key";
import { MyBotContext } from "../Context/BotMessageContext";
import { AuthContext } from "../Context/Auth";

// ===============================
// Fireworks AI setup
// ===============================
const FIREWORKS_BASE = "https://api.fireworks.ai/inference/v1";

async function getAIResponse(promptText) {
  try {
    const res = await fetch(`${FIREWORKS_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FIREWORKS_KEY}`,
      },
      body: JSON.stringify({
        model: FIREWORKS_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are CineMate AI — a smart movie assistant that helps users find, rate, and discover films easily.",
          },
          {
            role: "user",
            content: `${InitialPrompt}\n${promptText}`,
          },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "No response from CineMate AI.";
  } catch (err) {
    console.error("🔥 Fireworks Error:", err);
    return "Oops! I ran into a connection issue. Try again later.";
  }
}

function BotInterface({ height = 700, setActive }) {
  const { username } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const { messageHistory, setMessageHistory } = useContext(MyBotContext);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    const intro = {
      user: "CineMate AI",
      msg: {
        movieNames: [],
        message:
          "Hey there! 🎬 I'm CineMate — your friendly movie assistant. Ask me anything about films, actors, or get tailored recommendations!",
      },
    };
    if (messageHistory.length === 0) setMessageHistory([intro]);
  }, []);

  // Scroll chat automatically
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messageHistory]);

  // Fetch AI reply
  const fetchData = async (userPrompt) => {
    setIsLoading(true);
    try {
      const aiReply = await getAIResponse(userPrompt);

      setMessageHistory((prev) => [
        ...prev,
        {
          user: "CineMate AI",
          msg: {
            movieNames: [],
            message: aiReply,
          },
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessageHistory((prev) => [
        ...prev,
        {
          user: "CineMate AI",
          msg: {
            movieNames: [],
            message: "Sorry, something went wrong. Please try again later.",
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = () => {
    if (message.trim() === "" || isLoading) return;

    const newMessage = { user: username || "You", msg: { movieNames: [], message } };
    setMessageHistory((prev) => [...prev, newMessage]);
    fetchData(message);
    setMessage("");
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-4 flex flex-col mx-auto"
      style={{
        height: `${height}px`,
        maxHeight: "90vh",
        width: "95%",
        maxWidth: "500px",
        backgroundImage:
          "url('https://media1.tenor.com/m/S89fWSFaFowAAAAd/colors-pattern.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex justify-center items-center p-1 h-15 w-15">
          <ChatbotIcon />
        </div>

        <img
          src="https://media.tenor.com/NGFeo-Nn7WQAAAAi/milk-and-mocha-popcorn.gif"
          alt="watchingTV"
          className="absolute h-16 sm:h-20 top-2 sm:top-0 left-1/2 -translate-x-1/2"
        />

        <div>
          <button
            className="text-2xl font-bold hover:scale-150 duration-300 hover:text-red-600"
            onClick={() => setActive(false)}
          >
            X
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ height: `calc(${height}px - 100px)` }}
      >
        <div className="absolute inset-0 bg-gray-100 opacity-30"></div>
        <div
          ref={chatContainerRef}
          className="relative flex-grow overflow-auto p-3 h-full"
        >
          {messageHistory.map((msg, index) => (
            <Message key={index} msgObj={msg} />
          ))}

          {isLoading && (
            <div className="flex justify-start my-2">
              <div className="bg-white p-3 rounded-lg max-w-xs">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex items-center mt-3 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
        <input
          type="text"
          className="flex-grow outline-none bg-transparent text-black"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
        />
        <button
          className={`ml-2 ${
            isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl`}
          onClick={sendMessage}
          disabled={isLoading}
        >
          {isLoading ? "..." : "▲"}
        </button>
      </div>
    </div>
  );
}

export default BotInterface;
