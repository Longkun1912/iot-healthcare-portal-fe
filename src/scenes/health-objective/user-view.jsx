import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Toast } from "react-bootstrap";
import Header from "../../components/Header";
import "../../css/user-health-goals.css";
import useFetch from "../../hooks/useFetch";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import HealthObjectiveGoalDetailOption from "./goal-detail-option";
import RecommendedObjectives from "./recommended-objectives";

const UserObjectiveView = () => {
  const [selectedHealthObjective, setSelectedHealthObjective] = useState(null);
  const [recommendedHealthObjectives, setRecommendedHealthObjectives] =
    useState(null);
  const { data, loading, error, reFetch } = useFetch(
    apis.healthObjectiveManagement + "user_health_objectives"
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorFetching, setErrorFetching] = useState(null);

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      localStorage.setItem("user_health_objectives", JSON.stringify(data));
    };
    fetchData();
  }, [data]);

  const fetchRecommendedObjectives = async () => {
    setIsRefreshing(true);
    try {
      const recommendedHealthObjectives = await axios.get(
        apis.healthObjectiveManagement + "recommended_health_objectives",
        { headers: authHeader(), withCredentials: true }
      );
      setRecommendedHealthObjectives(recommendedHealthObjectives);
    } catch (error) {
      setErrorFetching(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendedObjectives();
  }, []);

  // Handle view recommended objectives
  const [openRecommendedObjectiveDialog, setOpenRecommendedObjectiveDialog] =
    useState(false);

  const handleShowRecommendedObjectiveDialog = () => {
    setOpenRecommendedObjectiveDialog(true);
  };

  const handleCloseRecommendedObjectiveDialog = () => {
    setOpenRecommendedObjectiveDialog(false);
  };

  // Handle view and maybe choose user health objectives
  const [openHealthObjectiveDialog, setOpenHealthObjectiveDialog] =
    useState(false);

  const handleShowHealthObjectiveDialog = (objective) => {
    setOpenHealthObjectiveDialog(true);
    setSelectedHealthObjective(objective);
  };

  const handleCloseHealthObjectiveDialog = () => {
    setOpenHealthObjectiveDialog(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 7000);
  };

  const handleDefaultCloseHealthObjectiveDialog = () => {
    setOpenHealthObjectiveDialog(false);
  };

  const handleToastClose = () => {
    setShowToast(false);
  };

  return (
    <Box m="3vh">
      <div className="title-alert">
        <Header title="Health Objectives" subtitle="Choose your best goal" />
        <Toast
          show={showToast}
          onClose={handleToastClose}
          className="set-goal-success-toast"
        >
          <Toast.Header>
            <div id="notification-header">
              <strong style={{ fontSize: "2.4vh" }} className="mr-auto">
                Notification
              </strong>
            </div>
          </Toast.Header>
          <Toast.Body className="notification-content">
            Congratulation! You have just set a new goal.
          </Toast.Body>
        </Toast>
      </div>
      <div className="goals-container">
        {data && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              maxWidth: "100%",
              margin: "2vh 2vh 0 2vh",
              justifyContent: "center",
            }}
          >
            {data.map((objective) => (
              <Card
                key={objective.id}
                sx={{
                  flex: "0 0 calc(33.3333% - 1.5vh)",
                  marginBottom: 2,
                  overflow: "unset",
                }}
              >
                <CardMedia
                  component="img"
                  height="120vh"
                  image={objective.image}
                  alt={objective.title}
                />
                <div className="goal-preview">
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      className="goal-title"
                    >
                      {objective.title}
                    </Typography>
                  </CardContent>
                  <Button
                    onClick={() => handleShowHealthObjectiveDialog(objective)}
                    className="btn btn-success"
                    id="choose-goal"
                  >
                    Choose
                  </Button>
                  {openHealthObjectiveDialog && (
                    <HealthObjectiveGoalDetailOption
                      show={openHealthObjectiveDialog}
                      goal={selectedHealthObjective}
                      handleCloseDefault={
                        handleDefaultCloseHealthObjectiveDialog
                      }
                      handleClose={handleCloseHealthObjectiveDialog}
                    />
                  )}
                </div>
              </Card>
            ))}
          </Box>
        )}
      </div>
      <div className="recommended-goals">
        <Button
          onClick={handleShowRecommendedObjectiveDialog}
          className="btn btn-danger"
          id="choose-recommended-goal"
        >
          View Your Recommended Goals
        </Button>
        {openRecommendedObjectiveDialog && (
          <RecommendedObjectives
            show={openRecommendedObjectiveDialog}
            recommendedHealthObjectives={recommendedHealthObjectives}
            isRefreshing={isRefreshing}
            handleClose={handleCloseRecommendedObjectiveDialog}
            error={errorFetching}
          />
        )}
      </div>
    </Box>
  );
};

export default UserObjectiveView;
