import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Thermometer from "react-thermometer-component";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";

const HealthObjectiveGoalDetailOption = ({
  goal,
  handleClose,
  handleCloseDefault,
  show,
}) => {
  const [loading, setLoading] = useState(false);
  const handleSetUserGoal = async () => {
    const healthObjectiveId = goal.id;
    setLoading(true);

    try {
      const res = await axios.put(
        `${apis.healthObjectiveManagement}health_objective?health_objective_id=${healthObjectiveId}`,
        null,
        { headers: authHeader(), withCredentials: true }
      );

      if (res.status === 200) {
        console.log("Health objective set successfully");
        setLoading(false);
        handleClose();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error setting health objective:", error);
    }
  };

  const handleCloseModal = () => {
    if (!loading) {
      handleCloseDefault();
    }
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
    >
      <div className="details-content">
        <Modal.Header closeButton>
          <Modal.Title className="modal-title" id="view-title">
            {goal.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <div className="goal-description">
            <div className="goal-picture">
              <img src={goal.image} alt="goal" id="goal-img" />
            </div>
            <div className="description-details">
              <p class="description-preview">
                {goal.description.length > 250
                  ? `${goal.description.slice(0, 250)}...`
                  : goal.description}
              </p>
              <p class="description-preview">
                More details can be found at:{" "}
                <a
                  href={goal.information_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {goal.information_url.length > 20
                    ? `${goal.information_url.slice(0, 20)}...`
                    : goal.information_url}
                </a>
              </p>
            </div>
          </div>
          <div className="goal-attributes">
            <div class="heart_img">
              <label id="aim-label">Body status aims</label>
              <img
                src="https://res.cloudinary.com/dokyaftrm/image/upload/v1707054722/iot-web-portal/system/heart_rate.png"
                alt="heart"
                id="heart-rate-img"
              />
              <p className="attribute-label" style={{ marginTop: "2vh" }}>
                Heart rate: {goal.heart_rate} bpm
              </p>
            </div>
            <div className="goal-temp">
              <div style={{ marginLeft: "4vh" }}>
                <Thermometer
                  theme="dark"
                  value={goal.temperature}
                  max="42"
                  steps="3"
                  format="°C"
                  size="medium"
                />
              </div>
              <p className="attribute-label" style={{ marginTop: "2vh" }}>
                Temperature: {goal.temperature} °C
              </p>
            </div>
            <div class="blood-pressure-data">
              <img
                src="https://res.cloudinary.com/dokyaftrm/image/upload/v1707058065/iot-web-portal/system/blood_pressure.png"
                alt="blood-pressure"
                id="blood-pressure-img"
              />
              <p className="attribute-label">
                Blood pressure: {goal.blood_pressure} mmHg
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button
            variant="success"
            onClick={handleSetUserGoal}
            disabled={loading}
          >
            {loading ? "Processing..." : "Set as your goal"}
          </Button>
          <Button variant="secondary" onClick={handleCloseDefault}>
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default HealthObjectiveGoalDetailOption;
