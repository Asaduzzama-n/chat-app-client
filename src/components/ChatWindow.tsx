/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchMessagesByChatId, sendMessage } from "../api/chat";
import { io } from "socket.io-client";

interface ChatWindowProps {
  chatId: string;
  receiverId: string; // Added receiverId as a prop
  user: any;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  receiverId,
  user,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // New state for selected image

  const socket = io("http://127.0.0.1:5000");

  useEffect(() => {
    socket.emit("joinChat", { chatId });
    const loadMessages = async () => {
      if (chatId) {
        const data = await fetchMessagesByChatId(chatId);
        setMessages(data);
        console.log(data);
      }
    };
    loadMessages();
    console.log(messages);
    // Listen for real-time messages from the server

    socket.on("messageReceived", (msg) => {
      console.log(msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("messageReceived"); // Clean up the listener on component unmount
    };
  }, [chatId]);

  const handleSend = async () => {
    if (newMessage.trim() || selectedImage) {
      await sendMessage(chatId, newMessage, receiverId, selectedImage);
      setNewMessage("");
      setSelectedImage(null); // Reset selected image after sending

      // Refresh messages after sending
      const updatedMessages = await fetchMessagesByChatId(chatId);
      setMessages(updatedMessages);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length &&
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex flex-col space-y-2 p-4 ${
                msg?.senderId?.customer ? "items-end" : "items-start"
              }`}
            >
              {/* Sender's Name on Top */}
              <div className="text-sm font-semibold text-gray-600">
                {msg?.senderId?.customer
                  ? msg?.senderId?.customer.name
                  : msg?.senderId?.vendor.name}
              </div>

              {/* Message Body */}
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                  msg.senderId?.customer
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {/* Message Content */}
                <p>{msg?.message}</p>

                {/* If there is an image attached, display it */}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attached content"
                    className="w-full h-auto rounded-lg mt-2"
                  />
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
          placeholder="Type a message"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="p-2"
          accept="image/*" // Optional: only allow image files
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
