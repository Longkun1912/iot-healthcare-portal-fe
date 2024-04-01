import axios from "axios";
import apis from "./api-service";
import authHeader from "./auth-header";

class ChatService {
  deleteMessage(messageId) {
    return axios.delete(apis.chat + `message?messageId=${messageId}`, {
      headers: authHeader(),
      widthCredentials: true,
    });
  }
}

export default new ChatService();
