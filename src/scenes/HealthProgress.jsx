import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Thermometer from "react-thermometer-component";
import "../css/health-progress.css";
import useFetch from "../hooks/useFetch";
import apis from "../services/api-service";
import authHeader from "../services/auth-header";
import HealthObjectiveProgress from "./health-objective/objective-progress";
import ProgressRecommendation from "./health-recommendation/progress-recommendation";

const HealthProgress = () => {
  const navigate = useNavigate();
  const [healthProgress, setHealthProgress] = useState(null);

  const { data, loading, error, reFetch } = useFetch(apis.healthProgress);

  useEffect(() => {
    if (data) {
      localStorage.setItem("healthProgress", JSON.stringify(data));
      window.onbeforeunload = () => {
        localStorage.removeItem("healthProgress");
      };
      setHealthProgress(JSON.parse(localStorage.getItem("healthProgress")));
    }
  }, [data]);

  // Components for handling date and time selection
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleDateTimeChange = (newDateTime) => {
    setSelectedDateTime(newDateTime);
  };

  const handleSubmittedDateTime = async () => {
    setRefresh(true);

    try {
      const res = await axios.get(
        `${apis.healthProgress}?dateTime=${selectedDateTime.format()}`,
        { headers: authHeader(), withCredentials: true }
      );

      if (res.status === 200) {
        setHealthProgress(res.data);
        localStorage.setItem("healthProgress", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      localStorage.removeItem("healthProgress");
      setHealthProgress(null);
    } finally {
      setRefresh(false);
    }
  };

  const formatTime = (time) => {
    const date = new Date(time);
    let hour = date.getHours();
    const minute = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let period = "AM";

    // Adjust hour and period for PM
    if (hour >= 12) {
      period = "PM";
      if (hour > 12) {
        hour -= 12;
      }
    }

    return `${hour}:${
      minute < 10 ? "0" : ""
    }${minute} ${period} at ${day}/${month}/${year}`;
  };

  const healthStatus = (status) => {
    if (
      status === "High / Need to decrease" ||
      status === "Low / Need to increase"
    ) {
      return "high";
    } else if (status === "Normal / Status Achieved") {
      return "normal";
    } else {
      return "";
    }
  };

  const overallStatus = (status) => {
    if (
      status ===
      "Health objective not achieved. Please follow the recommendations."
    ) {
      return "failed";
    } else if (status === "Congratulations! Health objective achieved.") {
      return "success";
    } else {
      return "";
    }
  };

  // Components for showing health goal details
  const [selectedHealthProgress, setSelectedHealthProgress] = useState(null);
  const [showHealthProgress, setShowHealthProgress] = useState(false);

  const handleShowHealthProgress = (healthProgress) => {
    setShowHealthProgress(true);
    setSelectedHealthProgress(healthProgress);
  };

  const handleCloseHealthProgress = () => {
    setShowHealthProgress(false);
  };

  // Components for showing health recommendation details
  const [selectedHealthRecommendation, setSelectedHealthRecommendation] =
    useState(null);
  const [showHealthRecommendation, setShowHealthRecommendation] =
    useState(false);

  const handleShowHealthRecommendation = (healthRecommendation) => {
    setShowHealthRecommendation(true);
    setSelectedHealthRecommendation(healthRecommendation);
  };

  const handleCloseHealthRecommendation = () => {
    setShowHealthRecommendation(false);
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <header className="jumbotron">
          <h3>
            <strong>Health Progress</strong>
          </h3>
        </header>
      </div>
      <div className="date-time-container">
        <strong className="date-time-title">
          Select date and time to view your health status:{" "}
        </strong>
        <div className="date-time-selection">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDateTimePicker
              value={selectedDateTime}
              onChange={handleDateTimeChange}
              textFieldVariant="standard"
            />
          </LocalizationProvider>
        </div>
        <Button
          id="submit-date-time-btn"
          className="btn btn-primary"
          onClick={handleSubmittedDateTime}
        >
          Submit
        </Button>
      </div>
      <div className="progress-body">
        {refresh ? (
          <p>Loading your status...</p>
        ) : error ? (
          <div>
            {console.error("Error fetching progress:", error)}{" "}
            <p>
              Error fetching your progress. Maybe you have't got any health
              record or set any goal
            </p>
          </div>
        ) : !healthProgress ? (
          <p>No status available at this current time</p>
        ) : (
          healthProgress && (
            <div className="current-progress">
              <div className="title-container">
                <strong className="progress-title">Health Status</strong>
              </div>
              <div className="current-time">
                <p className="time-text">
                  Current time:{" "}
                  {selectedDateTime
                    ? formatTime(selectedDateTime)
                    : healthProgress.currentHealth
                    ? formatTime(healthProgress.currentHealth.last_updated)
                    : "No time selected"}
                </p>
              </div>
              <div className="heart-rate-container">
                <div className="heart-rate">
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0"
                    y="0"
                    width="30vh"
                    height="20vh"
                    viewBox="0 0 150 73"
                    enableBackground="new 0 0 150 73"
                    xmlSpace="preserve"
                  >
                    <polyline
                      fill="none"
                      stroke="red"
                      strokeWidth="3"
                      strokeMiterlimit="10"
                      points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                    />
                  </svg>
                  <div className="fade-in"></div>
                  <div className="fade-out"></div>
                </div>
                <div className="heart-rate-analysis">
                  {healthProgress.currentHealth && (
                    <p className="status-text">
                      Heart rate: {healthProgress.currentHealth.heart_rate} bpm
                    </p>
                  )}
                  {healthProgress.healthAnalysis && (
                    <p className="status-text">
                      Status:{" "}
                      <span
                        className={`health-status-text ${healthStatus(
                          healthProgress.healthAnalysis.heartRateStatus
                        )}`}
                      >
                        {healthProgress.healthAnalysis.heartRateStatus}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="temperature-container">
                {healthProgress.currentHealth && (
                  <div className="thermometer-measurement">
                    <Thermometer
                      theme="light"
                      value={healthProgress.currentHealth.temperature}
                      max="42"
                      steps="3"
                      format="°C"
                      size="large"
                    />
                  </div>
                )}

                <div className="temperature-analysis">
                  {healthProgress.currentHealth && (
                    <p className="status-text">
                      Temperature: {healthProgress.currentHealth.temperature} °C
                    </p>
                  )}
                  {healthProgress.healthAnalysis && (
                    <p className="status-text">
                      Status:{" "}
                      <span
                        className={`health-status-text ${healthStatus(
                          healthProgress.healthAnalysis.temperatureStatus
                        )}`}
                      >
                        {healthProgress.healthAnalysis.temperatureStatus}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="blood-pressure-container">
                <div>
                  <img
                    src="https://res.cloudinary.com/dokyaftrm/image/upload/v1707815318/iot-web-portal/system/blood_pressure_measurement.png"
                    alt="blood_pressure"
                    id="blood-pressure-avatar"
                  />
                </div>
                <div className="blood-pressure-analysis">
                  {healthProgress.currentHealth && (
                    <p className="status-text">
                      Blood pressure:{" "}
                      {healthProgress.currentHealth.blood_pressure} mmHg
                    </p>
                  )}
                  {healthProgress.healthAnalysis && (
                    <p className="status-text">
                      Status:{" "}
                      <span
                        className={`health-status-text ${healthStatus(
                          healthProgress.healthAnalysis.bloodPressureStatus
                        )}`}
                      >
                        {healthProgress.healthAnalysis.bloodPressureStatus}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        )}
        <div className="goal-progress">
          {refresh ? (
            <p>Loading your goal...</p>
          ) : error ? (
            <div>
              {console.error("Error fetching goal:", error)}{" "}
              <p>Error fetching your goal</p>
            </div>
          ) : !healthProgress ? (
            <p>You haven't set any goal yet</p>
          ) : (
            healthProgress &&
            (!healthProgress.targetedHealth ? (
              <p>You haven't set any goal yet</p>
            ) : (
              <div className="goal-recommendations">
                {healthProgress.targetedHealth && (
                  <div className="goal-container">
                    <div style={{ paddingTop: "2.5vh" }}>
                      <strong className="health-goal-title">
                        Current goal
                      </strong>
                    </div>

                    <div className="goal-intro">
                      <img
                        src={healthProgress.targetedHealth.image}
                        alt="objective"
                        id="objective-img"
                      />
                      <div className="objective-title">
                        <p className="goal-text">
                          {healthProgress.targetedHealth.title}
                        </p>
                      </div>
                    </div>
                    <div className="overall-evaluation">
                      {healthProgress.healthAnalysis && (
                        <p className="overall-text">
                          Current evaluation:{""}
                          <span
                            className={`overall-text ${overallStatus(
                              healthProgress.healthAnalysis.overallStatus
                            )}`}
                          >
                            {healthProgress.healthAnalysis.overallStatus}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="objective-options">
                      <Button
                        className="btn btn-primary"
                        id="view-health-details-btn"
                        onClick={() => handleShowHealthProgress(healthProgress)}
                      >
                        View Details
                      </Button>
                      {showHealthProgress && (
                        <HealthObjectiveProgress
                          show={showHealthProgress}
                          healthProgress={selectedHealthProgress}
                          handleClose={handleCloseHealthProgress}
                        />
                      )}
                      <Button
                        id="select-new-goal-btn"
                        onClick={() =>
                          navigate(
                            "/health_objective-management/user_health_objectives"
                          )
                        }
                      >
                        Set New Goal
                      </Button>
                    </div>
                  </div>
                )}
                {healthProgress.healthAnalysis && (
                  <div className="recommendation-container">
                    <div style={{ paddingTop: "2vh" }}>
                      <strong className="recommendation-brief-title">
                        Recommendations
                      </strong>
                    </div>

                    {healthProgress.healthAnalysis && (
                      <div className="recommendation-list">
                        {healthProgress.healthAnalysis.recommendations.map(
                          (recommendation, index) => (
                            <div
                              key={index}
                              className="health-recommendation-item"
                            >
                              <div className="recommendation-name">
                                <p className="recommendation-text">
                                  {recommendation.name.length > 25
                                    ? `${recommendation.name.substring(
                                        0,
                                        25
                                      )}...`
                                    : recommendation.name}
                                </p>
                              </div>
                              <div className="view-recommendation-details">
                                <Button
                                  className="btn btn-success"
                                  id="select-recommendation-to-view"
                                  onClick={() =>
                                    handleShowHealthRecommendation(
                                      recommendation
                                    )
                                  }
                                >
                                  View
                                </Button>
                                {showHealthRecommendation && (
                                  <ProgressRecommendation
                                    show={showHealthRecommendation}
                                    recommendation={
                                      selectedHealthRecommendation
                                    }
                                    handleClose={
                                      handleCloseHealthRecommendation
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthProgress;
