import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import apis from "../services/api-service";
import authHeader from "../services/auth-header";

const genderOptions = ["Male", "Female", "Other"];

const EditProfile = ({
  user,
  handleClose,
  show,
  handleCloseDefault,
  reFetch,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    username: user.username,
    avatar: null,
    mobile: user.mobile,
  });

  const [gender, setGender] = useState(user.gender || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate whether input on each field below is empty or not
  const [formErrors, setFormErrors] = useState({
    username: "",
    avatar: null,
    mobile: "",
  });

  const handleChangeGender = (e) => {
    setGender(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Selected image: " + selectedFile.name);

    // Use the updated state value in the callback function
    setSelectedImage(selectedFile, () => {
      // Update the formData object with the selectedImage
      setFormData((prevData) => ({
        ...prevData,
        avatar: selectedFile,
      }));
    });
  };

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

    for (const field in formData) {
      if (formData[field] === "") {
        errors[field] = `This field is required.`;
        formIsValid = false;
      } else {
        errors[field] = "";
      }
    }

    if (gender === "") {
      errors.gender = "Gender is required.";
      formIsValid = false;
    }

    if (!formIsValid) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const updatedUser = new FormData();
    updatedUser.append("username", formData.username);
    updatedUser.append("email", user.email);
    updatedUser.append("mobile", formData.mobile);
    if (selectedImage) {
      updatedUser.append("avatar", selectedImage);
    }
    updatedUser.append("gender", gender);

    try {
      const res = await axios.put(apis.user + "profile", updatedUser, {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        const newUpdatedUser = await reFetch();
        localStorage.setItem("currentUser", JSON.stringify(newUpdatedUser));
        setIsSubmitting(false);
        handleClose();
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error updating user:", error);
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
          <Modal.Title className="modal-title">EDIT PROFILE</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form.Control
            type="hidden"
            name="email"
            value={user.email}
            readOnly
          />
          <div className="edit-row">
            <div className="left-edit">
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  onChange={handleChange}
                  value={formData.username}
                  type="text"
                  placeholder="Enter username"
                />
                {formErrors.username && (
                  <Form.Text className="text-danger error-validation-message">
                    {formErrors.username}
                  </Form.Text>
                )}
              </Form.Group>
            </div>
            <div className="right-edit">
              <Form.Group className="mb-3">
                <Form.Label>Avatar</Form.Label>
                <Form.Control
                  name="avatar"
                  accept="image/*"
                  onChange={handleImageChange}
                  type="file"
                />
                {formErrors.avatar && (
                  <Form.Text className="text-danger error-validation-message">
                    {formErrors.avatar}
                  </Form.Text>
                )}
              </Form.Group>
            </div>
          </div>

          <div className="edit-row">
            <div className="left-edit">
              <Form.Group className="mb-3">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  name="mobile"
                  onChange={handleChange}
                  value={formData.mobile}
                  type="text"
                  placeholder="Enter mobile"
                />
                {formErrors.mobile && (
                  <Form.Text className="text-danger error-validation-message">
                    {formErrors.mobile}
                  </Form.Text>
                )}
              </Form.Group>
            </div>
            <div className="right-edit">
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={gender}
                  onChange={(e) => handleChangeGender(e)}
                  placeholder="Select gender"
                >
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
                {formErrors.gender && (
                  <Form.Text className="text-danger error-validation-message">
                    {formErrors.gender}
                  </Form.Text>
                )}
              </Form.Group>
            </div>
          </div>
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
export default EditProfile;
