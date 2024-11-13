/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchChatList } from "../api/chat";

interface SidebarProps {
  onSelectChat: (chatId: string, receiverId: string) => void;
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectChat, user }) => {
  const [chatList, setChatList] = useState([]);
  console.log(chatList);
  const handleChatSelection = (chatId: string, receiverId: string) => {
    onSelectChat(chatId, receiverId);
  };

  useEffect(() => {
    const loadChatList = async () => {
      const chatData = await fetchChatList();
      setChatList(chatData);
    };
    loadChatList();
  }, []);

  return (
    <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
      <h2 className="font-semibold mb-4">
        Chats <span className="bg-green-500 rounded-md p-2">{user?.role}</span>
      </h2>
      <h2 className="font-semibold mb-4">
        <span className="bg-green-500 rounded-md p-2">{user?.email}</span>
      </h2>
      {chatList.map((chat: any) => (
        <div
          key={chat._id}
          onClick={() =>
            handleChatSelection(
              chat._id,
              user?.role === "CUSTOMER"
                ? chat?.participants[1]?.vendor._id
                : chat?.participants[0]?.customer._id
            )
          }
          className="mb-2 p-2 bg-white rounded cursor-pointer hover:bg-gray-100"
        >
          {user?.role === "CUSTOMER"
            ? chat.participants[1]?.vendor?.name
            : chat.participants[0]?.customer?.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
