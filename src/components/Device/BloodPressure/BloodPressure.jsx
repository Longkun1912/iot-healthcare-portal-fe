import { Button, useTheme } from "@mui/material";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { tokens } from "../../../theme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BloodPressure = ({ dayData, weekData, monthData }) => {
  const [selectedMode, setSelectedMode] = useState("thisMonth");
  const [chartData, setChartData] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const mapApiDataToChartData = (apiData, selectedMode) => {
    return {
      labels: apiData.map((record, index) => {
        const timestamp = new Date(record.last_updated);
        if (selectedMode === "thisWeek") {
          const dayOfWeek = timestamp.getDay();
          const dayOfWeekNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          return dayOfWeekNames[dayOfWeek];
        } else if (selectedMode === "thisMonth") {
          return `Week ${index + 1}`;
        } else {
          const time = timestamp.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return time;
        }
      }),
      datasets: [
        {
          label: "BloodPressure",
          data: apiData.map((record) => record.blood_pressure),
          borderColor: "rgb(75, 192, 192)",
        },
      ],
    };
  };

  const options = {
    scales: {
      x: {
        ticks: {
          color: colors.grey[100],
        },
      },
      y: {
        ticks: {
          color: colors.grey[100],
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: colors.grey[100],
        },
      },
    },
  };

  useEffect(() => {
    if (selectedMode === "today" && dayData) {
      setChartData(mapApiDataToChartData(dayData, selectedMode));
    } else if (selectedMode === "thisWeek" && weekData) {
      setChartData(mapApiDataToChartData(weekData, selectedMode));
    } else if (selectedMode === "thisMonth" && monthData) {
      setChartData(mapApiDataToChartData(monthData, selectedMode));
    }
  }, [selectedMode, dayData, weekData, monthData]);
  return (
    <div>
      <h1>BloodPressure</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          color={selectedMode === "today" ? "primary" : "secondary"}
          onClick={() => setSelectedMode("today")}
          style={{
            border: `1px solid ${colors.grey[100]}`,
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
          }}
        >
          Today
        </Button>
        <Button
          color={selectedMode === "thisWeek" ? "primary" : "secondary"}
          onClick={() => setSelectedMode("thisWeek")}
          style={{
            border: `1px solid ${colors.grey[100]}`,
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
          }}
        >
          This Week
        </Button>
        <Button
          color={selectedMode === "thisMonth" ? "primary" : "secondary"}
          onClick={() => setSelectedMode("thisMonth")}
          style={{
            border: `1px solid ${colors.grey[100]}`,
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
          }}
        >
          This Month
        </Button>
      </div>
      <div>
        {chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
};

export default BloodPressure;
