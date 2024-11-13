import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/SideBar";

const HomePage = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(
    null
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(user);
  const handleSelectChat = (chatId: string, receiverId: string) => {
    setSelectedChatId(chatId);
    setSelectedReceiverId(receiverId);
    console.log(chatId, receiverId);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelectChat={handleSelectChat} user={user} />
      {selectedChatId && selectedReceiverId ? (
        <ChatWindow
          receiverId={selectedReceiverId}
          chatId={selectedChatId}
          user={user}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};

export default HomePage;
