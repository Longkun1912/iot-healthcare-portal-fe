import axios from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "../../css/edit-message.css";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";

const EditMessage = ({ messageId, show, close, defaultClose, oldContent }) => {
  const [messageContent, setMessageContent] = useState(oldContent);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = (messageText) => {
    setMessage(messageText);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
      setMessage("");
    }, 7000);
  };

  const handleSave = async (messageId) => {
    if (messageContent === "") {
      handleShowMessage("Message cannot be empty");
      return;
    } else if (messageContent === oldContent) {
      handleShowMessage("Message cannot be the same as the old one");
      return;
    } else {
      try {
        const response = await axios.put(
          apis.chat +
            `message?messageId=${messageId}&content=${messageContent}`,
          {},
          {
            headers: authHeader(),
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          close();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      show={show}
      onHide={defaultClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label id="update-message-label" htmlFor="message">
              Change message:
            </label>
            <textarea
              className="form-control"
              id="message"
              placeholder={oldContent}
              value={messageContent}
              rows={4}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            {showMessage && (
              <div class="alert alert-danger" role="alert">
                {message}
              </div>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={defaultClose}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={messageContent === oldContent && messageContent === ""}
          onClick={handleSave.bind(null, messageId)}
        >
          Save changes
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditMessage;
