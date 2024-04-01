import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const HealthObjectiveProgress = ({ show, healthProgress, handleClose }) => {
  const getStatus = (current, target) => {
    return current === target ? "Achieved" : "Not Achieved";
  };

  const getStatusClass = (status) => {
    return status === "Achieved" ? "achieved" : "not-achieved";
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <div className="modal-health-details">
        <Modal.Header closeButton>
          <Modal.Title className="health-goal-progress-title">
            {healthProgress.targetedHealth.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="goal-detail-body">
          <div className="status-progress">
            <div className="heart-rate-progress">
              <div className="title-status">
                <strong className="status-name-comp">Heart Rate</strong>
              </div>
              <p
                className="health-status-letter"
                style={{ marginTop: "1.5vh" }}
              >
                Aim: {healthProgress.targetedHealth.heart_rate} bpm
              </p>
              <p className="health-status-letter">
                Current: {healthProgress.currentHealth.heart_rate} bpm
              </p>
              <p className="health-status-letter">
                Status:{" "}
                <span
                  className={getStatusClass(
                    getStatus(
                      healthProgress.currentHealth.heart_rate,
                      healthProgress.targetedHealth.heart_rate
                    )
                  )}
                >
                  {getStatus(
                    healthProgress.currentHealth.heart_rate,
                    healthProgress.targetedHealth.heart_rate
                  )}
                </span>
              </p>
            </div>
            <div className="blood-pressure-progress">
              <div className="title-status">
                <strong className="status-name-comp">Blood Pressure</strong>
              </div>
              <p
                className="health-status-letter"
                style={{ marginTop: "1.5vh" }}
              >
                Aim: {healthProgress.targetedHealth.blood_pressure} mmHg
              </p>
              <p className="health-status-letter">
                Current: {healthProgress.currentHealth.blood_pressure} mmHg
              </p>
              <p className="health-status-letter">
                Status:{" "}
                <span
                  className={getStatusClass(
                    getStatus(
                      healthProgress.currentHealth.blood_pressure,
                      healthProgress.targetedHealth.blood_pressure
                    )
                  )}
                >
                  {getStatus(
                    healthProgress.currentHealth.blood_pressure,
                    healthProgress.targetedHealth.blood_pressure
                  )}
                </span>
              </p>
            </div>
            <div className="temperature-progress">
              <div className="title-status">
                <strong className="status-name-comp">Temperature</strong>
              </div>
              <p
                className="health-status-letter"
                style={{ marginTop: "1.5vh" }}
              >
                Aim: {healthProgress.targetedHealth.temperature} °C
              </p>
              <p className="health-status-letter">
                Current: {healthProgress.currentHealth.temperature} °C
              </p>
              <p className="health-status-letter">
                Status:{" "}
                <span
                  className={getStatusClass(
                    getStatus(
                      healthProgress.currentHealth.temperature,
                      healthProgress.targetedHealth.temperature
                    )
                  )}
                >
                  {getStatus(
                    healthProgress.currentHealth.temperature,
                    healthProgress.targetedHealth.temperature
                  )}
                </span>
              </p>
            </div>
          </div>
          <div className="full-goal-overview">
            <div className="goal-image-full">
              <img
                src={healthProgress.targetedHealth.image}
                alt="health-goal"
                id="full-goal-img"
              />
            </div>
            <div className="goal-description-full">
              <p className="goal-description-text">
                Description:{" "}
                {healthProgress.targetedHealth.description.length > 200
                  ? `${healthProgress.targetedHealth.description.slice(
                      0,
                      200
                    )}...`
                  : healthProgress.targetedHealth.description}
              </p>
              <p className="goal-description-text">
                Further details link:
                <a
                  href={healthProgress.targetedHealth.information_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginLeft: "0.5vh" }}
                >
                  {healthProgress.targetedHealth.information_url.length > 25
                    ? `${healthProgress.targetedHealth.information_url.slice(
                        0,
                        25
                      )}...`
                    : healthProgress.targetedHealth.information_url}
                </a>
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default HealthObjectiveProgress;
