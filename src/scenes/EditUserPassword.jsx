import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import apis from "../services/api-service";
import authHeader from "../services/auth-header";

const EditUserPassword = ({ user, handleClose, handleCloseDefault, show }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serverError, setServerError] = useState("");

  // Validate whether input on each field below is empty or not
  const [formErrors, setFormErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error message when user starts typing in the field
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = {};
    let formIsValid = true;

    if (formData.oldPassword === "") {
      errors.oldPassword = "Old password cannot be empty.";
      formIsValid = false;
    }

    if (formData.newPassword === "") {
      errors.newPassword = "New password cannot be empty.";
      formIsValid = false;
    }

    if (formData.confirmNewPassword === "") {
      errors.confirmNewPassword = "Confirm new password cannot be empty.";
      formIsValid = false;
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      errors.confirmNewPassword = "Passwords do not match.";
      formIsValid = false;
    }

    if (!formIsValid) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const updatedUserPassword = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      email: user.email,
    };

    console.log("User to be updated:", JSON.stringify(updatedUserPassword));

    try {
      const res = await axios.put(apis.user + "password", updatedUserPassword, {
        headers: authHeader(),
        withCredentials: true,
      });

      if (res.status === 200) {
        setIsSubmitting(false);
        handleClose();
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error updating user:", error);

      if (error.response && error.response.data) {
        setServerError(error.response.data);
      } else {
        setServerError("An error occurred while updating the password.");
      }
    }
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleCloseDefault}
      backdrop="static"
      keyboard={false}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">EDIT PASSWORD</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form.Control
            type="hidden"
            name="email"
            value={user.email}
            readOnly
          />
          <Form.Group className="mb-3">
            <Form.Label className="password-input-label">
              Current Password
            </Form.Label>
            <Form.Control
              name="oldPassword"
              onChange={handleChange}
              value={formData.oldPassword}
              type="password"
              placeholder="Enter old password"
            />
            {formErrors.oldPassword && (
              <Form.Text className="text-danger error-validation-message">
                {formErrors.oldPassword}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="password-input-label">
              New Password
            </Form.Label>
            <Form.Control
              name="newPassword"
              onChange={handleChange}
              value={formData.newPassword}
              type="password"
              placeholder="Enter new password"
            />
            {formErrors.newPassword && (
              <Form.Text className="text-danger error-validation-message">
                {formErrors.newPassword}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="password-input-label">
              Confirm New Password
            </Form.Label>
            <Form.Control
              name="confirmNewPassword"
              onChange={handleChange}
              value={formData.confirmNewPassword}
              type="password"
              placeholder="Confirm new password"
            />
            {formErrors.confirmNewPassword && (
              <Form.Text className="text-danger error-validation-message">
                {formErrors.confirmNewPassword}
              </Form.Text>
            )}
          </Form.Group>
          {serverError && (
            <div className="alert alert-danger mt-3">{serverError}</div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="secondary" onClick={handleCloseDefault}>
            Close
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? "Updating..." : "Save changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditUserPassword;
