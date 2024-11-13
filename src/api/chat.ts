import { authAxios } from "./auth";

export const fetchChatList = async () => {
  const response = await authAxios.get("/chat/chat-list");
  return response.data.data;
};

export const fetchMessagesByChatId = async (chatId: string) => {
  const response = await authAxios.get(`/message/${chatId}`);
  return response.data.data;
};

export const sendMessage = async (
  chatId: string,
  message: string,
  receiverId: string,
  imageFile?: File
) => {
  const formData = new FormData();
  formData.append("receiverId", receiverId);
  formData.append("chatId", chatId);
  formData.append("message", message);

  if (imageFile) {
    formData.append("image", imageFile); // Assumes the backend expects an `image` field for file uploads
  }

  const response = await authAxios.post(`/message/send-message/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};
