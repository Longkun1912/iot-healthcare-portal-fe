import axios from "axios";
import { jwtDecode } from "jwt-decode";
import apis from "./api-service";

class AuthService {
  login(email, password) {
    return axios
      .post(apis.account + "login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.jwt_token) {
          console.log(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    return axios.post(apis.account + "logout");
  }

  register(formData) {
    return axios.post(apis.account + "register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.jwt_token) {
      const decodedToken = jwtDecode(user.jwt_token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token has expired, clear local storage
        localStorage.removeItem("user");
        return null;
      }
    }
    return user;
  }
}

export default new AuthService();
