import "./ExerciseChart.scss";
import Async from "../Async/Async";
import { LineChart } from "@mui/x-charts";
import { useEffect, useRef, useState } from "react";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom";

type ExerciseChartProps = {
  exerciseId: number;
};

export default function ExerciseChart({ exerciseId }: ExerciseChartProps) {
  const [chartData, setChartData] = useState<Promise<
    APIResponse<
      "/api/workout/{creator}/{name}/mock-exercise-chart-data/{exerciseId}",
      "get"
    >
  > | null>(null);
  const sentRequest = useRef(false);

  const params = useParams();
  useEffect(() => {
    if (
      sentRequest.current ||
      params.username === undefined ||
      params.name === undefined
    )
      return;

    sentRequest.current = true;

    setChartData(
      sendAPIRequest(
        "/api/workout/{creator}/{name}/mock-exercise-chart-data/{exerciseId}",
        {
          method: "get",
          parameters: {
            creator: params.username,
            name: params.name,
            exerciseId: exerciseId,
          },
        }
      )
    );
  }, [params, exerciseId]);

  return (
    <>
      {chartData && (
        <Async await={chartData}>
          {(response) => {
            if (response?.code !== "OK") return null;
            const chart = response.content.data.slice(
              response.content.data.length - 30
            );

            return createPortal(
              <div className="exercise-chart-container">
                <div className="exercise-chart-header"></div>
                <div className="exercise-chart-container">
                  <LineChart
                    xAxis={[
                      {
                        data: chart.map((x) => new Date(x.timeCompleted)),
                        scaleType: "time",
                      },
                    ]}
                    series={[
                      {
                        data: chart.map((x) => x.weightUsed),
                        color: "#f9aa81",
                      },
                    ]}
                    tooltip={{
                      classes: {
                        root: "tooltip",
                      },
                    }}
                    sx={{
                      "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel, & .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":
                        {
                          fill: "#fff",
                        },
                      "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick": {
                        stroke: "#fff",
                      },
                      "& .MuiChartsAxis-bottom .MuiChartsAxis-line, & .MuiChartsAxis-left .MuiChartsAxis-line":
                        {
                          stroke: "#fff",
                          strokeWidth: 2.5,
                        },
                    }}
                  />
                </div>
              </div>,
              document.body
            );
          }}
        </Async>
      )}
    </>
  );
}
