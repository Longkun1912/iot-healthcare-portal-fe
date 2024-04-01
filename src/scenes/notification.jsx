import Toast from "react-bootstrap/Toast";

const NotificationToast = ({ show, onClose, message }) => {
  return (
    <Toast show={show} onClose={onClose} className="set-goal-success-toast">
      <Toast.Header>
        <div id="notification-header">
          <strong style={{ fontSize: "2.4vh" }} className="mr-auto">
            Notification
          </strong>
        </div>
      </Toast.Header>
      <Toast.Body className="notification-content">{message}</Toast.Body>
    </Toast>
  );
};

export default NotificationToast;
