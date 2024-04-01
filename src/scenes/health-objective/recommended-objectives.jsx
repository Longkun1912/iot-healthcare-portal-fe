import { Modal } from "react-bootstrap";

const RecommendedObjectives = ({
  show,
  recommendedHealthObjectives,
  isRefreshing,
  error,
  handleClose,
}) => {
  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Goal Setting Hint</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isRefreshing ? (
          <p>Loading recommended health objectives...</p>
        ) : error ? (
          <p style={{ fontSize: "2.5vh", lineHeight: "5vh" }}>
            You have't got any health record for recommendation. Please provide
            at least one for us to understand your body.
          </p>
        ) : (
          <div>
            <p style={{ fontSize: "2.5vh" }}>
              {recommendedHealthObjectives.data.length > 0 ? (
                <div className="goals-for-you">
                  <span>
                    Based on your current health status, we recommend these
                    goals will be essential for you.
                  </span>
                  <ul style={{ marginTop: "2vh" }}>
                    {recommendedHealthObjectives.data.map((objective) => (
                      <li key={objective.id}>
                        <p>{objective.title}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <span>
                  Your current health status looks well overall. You can set any
                  health objective that you want.
                </span>
              )}
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RecommendedObjectives;
