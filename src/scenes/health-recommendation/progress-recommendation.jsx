import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ProgressRecommendation = ({ show, recommendation, handleClose }) => {
  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <div className="modal-recommendation-details">
        <Modal.Header closeButton>
          <Modal.Title className="health-goal-progress-title">
            {recommendation.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="recommendation-body">
          <div className="recommendation-status-details">
            <div className="rec-symbol">
              <img
                src="https://res.cloudinary.com/dokyaftrm/image/upload/v1708594616/iot-web-portal/system/caduceus_health_symbol.png"
                alt="health symbol"
                className="recommendation-symbol"
              />
            </div>
            <div className="recommendation-status">
              <div className="recommendation-heart-rate">
                <p className="rec-status-txt">
                  Heart rate impact: {recommendation.heart_rate_impact}
                </p>
              </div>
              <div className="recommendation-blood-pressure">
                <p className="rec-status-txt">
                  Blood pressure impact: {recommendation.blood_pressure_impact}
                </p>
              </div>
              <div className="recommendation-temp">
                <p className="rec-status-txt">
                  Temperature impact: {recommendation.temperature_impact}
                </p>
              </div>
            </div>
          </div>
          <div className="rec-additional-info">
            <div className="rec-info-container">
              <p className="rec-info-txt">{recommendation.description}</p>
              <p className="rec-info-txt">
                Further Guide:{" "}
                <a
                  href={recommendation.guide_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {recommendation.guide_link.length > 70
                    ? `${recommendation.guide_link.substring(0, 70)}...`
                    : recommendation.guide_link}
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

export default ProgressRecommendation;
