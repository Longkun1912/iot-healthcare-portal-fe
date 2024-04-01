import axios from "axios";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBInputGroup,
  MDBRow,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { BiSolidMessageAdd } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Header from "../../components/Header";
import "../../css/chat.css";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import ChatService from "../../services/chat.service";
import NotificationToast from "../notification";
import EditMessage from "./editMessage";

const Inbox = () => {
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 7000
  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage("");
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 7000);
    }
  }, [showToast]);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [chats, setChats] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingChatError, setFetchingChatError] = useState(null);
  const [fetchingMessageError, setFetchingMessageError] = useState(null);
  const [fetchingMembersError, setFetchingMembersError] = useState(null);
  const [adminEmail, setAdminEmail] = useState("");

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchChatText, setSearchChatText] = useState("");
  const [searchMemberText, setSearchMemberText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [messageContent, setMessageContent] = useState("");

  const sendMessage = async (chatId, content) => {
    // Send message to the chat
    if (content && chatId) {
      await axios
        .post(
          apis.chat + `message?chatId=${chatId}&content=${content}`,
          {},
          { headers: authHeader(), withCredentials: true }
        )
        .then((response) => {
          console.log("Message sent successfully:", response);
          setRefresh(true);
          fetchLatestMessages();
          fetchCurrentChats();
          setMessageContent("");
          setRefresh(false);
          setMessage("Message sent successfully");
          setShowToast(true);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  // Edit message
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState({});

  const handleOpenEditForm = (message) => {
    setSelectedMessage(message);
    setOpenEditForm(true);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    fetchLatestMessages();
    fetchCurrentChats();
    setMessage("Message edited successfully");
    setShowToast(true);
  };

  const handleDefaultCloseEditForm = () => {
    setOpenEditForm(false);
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    console.log("Delete message id: ", messageId);
    try {
      await ChatService.deleteMessage(messageId).then((response) => {
        console.log("Message deleted successfully:", response);
        setRefresh(true);
        fetchLatestMessages();
        fetchCurrentChats();
        setRefresh(false);
        setMessage("Message deleted successfully");
        setShowToast(true);
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Handle fetching admin email
  const fetchAdminEmail = async () => {
    try {
      const response = await axios.get(apis.user + "adminEmail", {
        headers: authHeader(),
        withCredentials: true,
      });
      setAdminEmail(response.data);
    } catch (error) {
      console.error("Error fetching admin email:", error);
    }
  };

  useEffect(() => {
    fetchAdminEmail();
  }, []);

  // Handle fetching members in the organisation
  const fetchMembersInOrganisation = async () => {
    setFetching(true);
    try {
      if (currentUser.roles.some((role) => role === "admin")) {
        const memberResponse = await axios.get(apis.user + "all/members", {
          headers: authHeader(),
          withCredentials: true,
        });
        setMembers(memberResponse.data);
      } else {
        const memberResponse = await axios.get(
          apis.user + "organisation/members",
          { headers: authHeader(), withCredentials: true }
        );
        setMembers(memberResponse.data);
      }
    } catch (error) {
      setFetchingMembersError(error);
      console.error("Error fetching members in organisation:", error);
    } finally {
      setFetching(false);
    }
  };

  // Handle fetching current chats
  const fetchCurrentChats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apis.chat + "chats", {
        headers: authHeader(),
        withCredentials: true,
      });
      setChats(response.data);
    } catch (error) {
      setFetchingChatError(error);
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle fetching latest messages
  const fetchLatestMessages = async () => {
    try {
      const response = await axios.get(
        apis.chat + `${currentUser.id}/latestMessages`,
        {
          headers: authHeader(),
          withCredentials: true,
        }
      );
      setChatId(response.data.chatId);
      setMessages(response.data.latestMessages);
    } catch (error) {
      setFetchingMessageError(error);
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch chats and members on component mount
  useEffect(() => {
    fetchCurrentChats();
    fetchMembersInOrganisation();
  }, []);

  // Fetch latest messages on component mount
  useEffect(() => {
    fetchLatestMessages();
  }, []);

  // Handle selecting a chat to print messages
  const handleSelectChat = async (chat) => {
    setRefresh(true);
    setChatId(chat.id);
    try {
      const response = await axios.get(apis.chat + `${chat.id}/messages`, {
        headers: authHeader(),
        withCredentials: true,
      });
      setMessages(response.data);
      console.log("Messages:", response.data);
    } catch (error) {
      setFetchingMessageError(error);
      console.error("Error fetching messages:", error);
    } finally {
      setRefresh(false);
    }
  };

  // Handle creating an inbox
  const handleCreateInbox = async (email) => {
    try {
      const response = await axios.post(
        apis.chat + `create?email=${email}`,
        {},
        {
          headers: authHeader(),
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        if (email === adminEmail) {
          setMessage("You are having a chat with the admin");
        } else {
          setMessage("Inbox created successfully");
        }
        setShowToast(true);

        fetchCurrentChats();
        fetchLatestMessages();
        fetchMembersInOrganisation();
      }
    } catch (error) {
      console.error("Error creating inbox:", error);
    }
  };

  // Handle deleting a chat
  const handleDeleteChat = async (chatId) => {
    try {
      const response = await axios.delete(apis.chat + `${chatId}`, {
        headers: authHeader(),
        withCredentials: true,
      });
      if (response.status === 200) {
        setMessage("Chat deleted successfully");
        setShowToast(true);
        fetchCurrentChats();
        fetchMembersInOrganisation();
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  // Handle dropdown menu for message options
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Handle message date formatting
  const formatLatestMessageDateTime = (dateTime) => {
    const now = new Date();
    const then = new Date(dateTime);
    const diffInMs = Math.abs(now - then);
    const diffInSecs = Math.floor(diffInMs / 1000);

    if (diffInSecs < 60) {
      return "Just now";
    } else if (diffInSecs < 3600) {
      const minutes = Math.floor(diffInSecs / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`; // Handle pluralization
    } else if (diffInSecs < 86400) {
      const hours = Math.floor(diffInSecs / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSecs < 2592000) {
      // Approximately 30 days
      const days = Math.floor(diffInSecs / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (diffInSecs < 31536000) {
      // Approximately 1 year
      const months = Math.floor(diffInSecs / 2592000);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffInSecs / 31536000);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  };

  // Handle message date formatting
  const formatMessageDateTime = (dateString) => {
    const formattedDate = new Date(dateString);

    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
    };

    return formattedDate.toLocaleString("en-US", options, { timeZone: "UTC" });
  };

  const headerTitle = "Inbox";
  let headerSubtitle = "";

  if (currentUser.roles.some((role) => role === "admin")) {
    headerSubtitle = "Message with any user in the system";
  } else {
    headerSubtitle = "Message with any member in your organization";
  }

  return (
    <MDBContainer fluid>
      <MDBRow>
        <div className="topic-title">
          <Header
            title={headerTitle}
            subtitle={headerSubtitle}
            id="topic-header"
          />
          <NotificationToast
            show={showToast}
            onClose={() => setShowToast(false)}
            message={message}
            id="chat-toast"
          />
        </div>
        <MDBCol id="chat-container-col">
          <MDBCard id="chat-management">
            <MDBCardBody>
              <MDBRow>
                <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                  <div className="p-3" style={{ marginLeft: "-3vh" }}>
                    <MDBInputGroup className="rounded mb-3" id="search-field">
                      <input
                        className="form-control rounded"
                        placeholder="Search chat by username"
                        type="search"
                        value={searchChatText}
                        onChange={(event) =>
                          setSearchChatText(event.target.value)
                        }
                      />
                    </MDBInputGroup>

                    <div>
                      {loading ? (
                        <p>Loading chats...</p>
                      ) : fetchingChatError ? (
                        <p>Error fetching chats</p>
                      ) : (
                        <div className="chat-container">
                          <div className="chat-list-header">
                            <p className="chat-list-title-text">Inbox:</p>
                            {currentUser &&
                            !currentUser.roles.some(
                              (role) => role === "admin"
                            ) ? (
                              <button
                                onClick={() => handleCreateInbox(adminEmail)}
                                className="contact-admin-btn"
                              >
                                Contact admin
                              </button>
                            ) : null}
                          </div>
                          {chats && chats.length > 0 ? (
                            <Scrollbars
                              suppressScrollX
                              style={{ position: "relative", height: "40vh" }}
                            >
                              <ul className="list-unstyled">
                                {chats
                                  .filter((chat) =>
                                    chat.name
                                      .toLowerCase()
                                      .includes(searchChatText.toLowerCase())
                                  )
                                  .map((chat, index) => (
                                    <React.Fragment key={index}>
                                      <li
                                        className="p-2 border-bottom"
                                        style={{ display: "flex" }}
                                      >
                                        <Button
                                          variant="light"
                                          className="d-flex justify-content-between"
                                          id="chat-list-item"
                                          onClick={() => {
                                            handleSelectChat(chat);
                                          }}
                                        >
                                          <div className="d-flex flex-row">
                                            <div>
                                              <img
                                                src={chat.image}
                                                alt="avatar"
                                                className="d-flex align-self-center me-3"
                                                id="chat-avatar"
                                              />
                                              <span className="badge bg-success badge-dot"></span>
                                            </div>
                                            <div className="pt-1">
                                              <p
                                                className="fw-bold mb-0"
                                                style={{ textAlign: "left" }}
                                              >
                                                {chat.name.length > 15
                                                  ? `${chat.name.slice(
                                                      0,
                                                      15
                                                    )}...`
                                                  : chat.name}
                                              </p>
                                              <p
                                                className="small text-muted"
                                                style={{ textAlign: "left" }}
                                              >
                                                {chat.latestMessage.content
                                                  .length > 15
                                                  ? `${chat.latestMessage.content.slice(
                                                      0,
                                                      15
                                                    )}...`
                                                  : chat.latestMessage.content}
                                              </p>
                                            </div>
                                          </div>
                                        </Button>
                                        <div className="pt-1">
                                          <p
                                            className="small text-muted mb-1"
                                            id="chat-time-text"
                                          >
                                            {formatLatestMessageDateTime(
                                              chat.latestMessage.sent_at
                                            )}
                                          </p>
                                          <Button
                                            id="remove-chat-btn"
                                            onClick={() =>
                                              handleDeleteChat(chat.id)
                                            }
                                          >
                                            Delete
                                          </Button>
                                        </div>
                                      </li>
                                    </React.Fragment>
                                  ))}
                              </ul>
                            </Scrollbars>
                          ) : (
                            <p>
                              {searchChatText
                                ? "No matching chats found"
                                : "You have no inbox at the moment"}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </MDBCol>

                <MDBCol md="6" lg="7" xl="8" style={{ display: "flex" }}>
                  <div className="message-chat-container">
                    {refresh ? (
                      <p id="empty-message-warning">Loading messages...</p>
                    ) : fetchingMessageError ? (
                      <p id="empty-message-warning">Error fetching messages</p>
                    ) : (
                      <Scrollbars className="pt-3 pe-3" id="chat-scrollbars">
                        {messages && messages.length > 0 ? (
                          <div>
                            <div id="chat-message-container">
                              {messages.map((message, index) =>
                                message.sender.id !== currentUser.id ? (
                                  <div
                                    className="d-flex flex-row justify-content-start"
                                    key={index}
                                  >
                                    <img
                                      src={message.sender.avatar}
                                      alt="avatar 1"
                                      className="sender-avatar"
                                    />
                                    <div style={{ flexBasis: "80%" }}>
                                      <div className="receiver-content-container">
                                        <p
                                          className="small p-2 ms-3 mb-1 rounded-3"
                                          id="message-content-text"
                                          style={{
                                            backgroundColor: "lightgrey",
                                          }}
                                        >
                                          {message.content}
                                        </p>
                                      </div>
                                      <div className="receiver-content-container">
                                        <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                                          {formatMessageDateTime(
                                            message.sent_at
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="d-flex flex-row justify-content-end"
                                    key={index}
                                  >
                                    <div style={{ flexBasis: "80%" }}>
                                      <div className="sender-content-container">
                                        <div className="dropdown">
                                          <button
                                            className="dropbtn"
                                            onClick={handleClick}
                                          >
                                            <BsThreeDotsVertical
                                              onClick={handleClick}
                                            />
                                          </button>
                                          {isOpen && (
                                            <div className="dropdown-content">
                                              <button
                                                className="dropdown-menu-button"
                                                onClick={() =>
                                                  handleOpenEditForm(message)
                                                }
                                              >
                                                Edit
                                              </button>

                                              <button
                                                onClick={() =>
                                                  handleDeleteMessage(
                                                    message.id
                                                  )
                                                }
                                                className="dropdown-menu-button"
                                              >
                                                Delete
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                        <p
                                          className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary"
                                          id="message-content-text"
                                        >
                                          {message.content}
                                        </p>
                                      </div>
                                      <div className="sender-content-container">
                                        <p className="small me-3 mb-3 rounded-3 text-muted">
                                          {formatMessageDateTime(
                                            message.sent_at
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    <img
                                      src={message.sender.avatar}
                                      alt="avatar 1"
                                      className="sender-avatar"
                                    />
                                  </div>
                                )
                              )}
                              {openEditForm && (
                                <EditMessage
                                  messageId={selectedMessage.id}
                                  oldContent={selectedMessage.content}
                                  show={openEditForm}
                                  close={handleCloseEditForm}
                                  defaultClose={handleDefaultCloseEditForm}
                                />
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-center" id="empty-message-warning">
                            No messages yet
                          </p>
                        )}
                      </Scrollbars>
                    )}
                    <div
                      id="sender-type"
                      className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2"
                    >
                      {!currentUser ? (
                        <img
                          src="https://res.cloudinary.com/dokyaftrm/image/upload/v1706801569/iot-web-portal/users/anonymous_user.png"
                          alt="avatar 3"
                          className="sender-avatar"
                        />
                      ) : (
                        <img
                          src={currentUser.avatar}
                          alt="avatar 3"
                          className="sender-avatar"
                        />
                      )}

                      <input
                        type="text"
                        value={messageContent}
                        className="form-control form-control-lg"
                        id="sender-input"
                        placeholder="Type message"
                        onChange={(e) => setMessageContent(e.target.value)}
                      />
                      <IoMdSend
                        onClick={() => sendMessage(chatId, messageContent)}
                        id="send-input"
                      />
                    </div>
                  </div>
                  <div className="no-chat-member">
                    <MDBInputGroup className="rounded mb-3">
                      <input
                        className="form-control rounded"
                        id="search-member-input"
                        placeholder="Search member by username or email"
                        type="search"
                        value={searchMemberText}
                        onChange={(event) =>
                          setSearchMemberText(event.target.value)
                        }
                      />
                    </MDBInputGroup>
                    <p id="member-title">Other members:</p>
                    <div className="member-list-container">
                      {fetching ? (
                        <p style={{ marginLeft: "2vh" }}>Loading members...</p>
                      ) : fetchingMembersError ? (
                        <p style={{ marginLeft: "2vh" }}>
                          Error fetching members
                        </p>
                      ) : !members ? (
                        <p style={{ marginLeft: "2vh" }}>No members found</p>
                      ) : (
                        members
                          .filter(
                            (member) =>
                              member.username
                                .toLowerCase()
                                .includes(searchMemberText.toLowerCase()) ||
                              member.email
                                .toLowerCase()
                                .includes(searchMemberText.toLowerCase())
                          )
                          .map((member, index) => (
                            <div
                              className="d-flex flex-row justify-content-between"
                              key={index}
                              id="member-list-item-container"
                            >
                              <div
                                className="d-flex flex-row"
                                id="member-all-info"
                              >
                                <img
                                  src={member.avatar}
                                  alt="avatar"
                                  className="d-flex align-self-center me-3"
                                  id="member-avatar"
                                />
                                <div
                                  className="pt-1"
                                  id="member-details-container"
                                >
                                  <p
                                    className="fw-bold mb-0"
                                    id="member-username"
                                  >
                                    {member.username.length > 19
                                      ? member.username.substring(0, 16) + "..."
                                      : member.username}
                                  </p>
                                  <p className="small text-muted">
                                    {member.email.length > 22
                                      ? member.email.substring(0, 19) + "..."
                                      : member.email}
                                  </p>
                                </div>
                                <BiSolidMessageAdd
                                  onClick={() =>
                                    handleCreateInbox(member.email)
                                  }
                                  className="add-to-chat"
                                />
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Inbox;
