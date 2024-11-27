import "./ExerciseChart.scss";
import Async from "../Async/Async";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { useParams } from "react-router-dom";
import { LineChart } from "@mui/x-charts";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Dropdown from "../DropdownMenu/Dropdown";
import { addMonths } from "../../Utility/DateUtils";
import FocusTrap from "focus-trap-react";
import Icon from "../Icon/Icon";

type ExerciseChartProps = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
};

type Timeframe = 3 | 6 | 12;

const ExerciseChart = memo(({ exercise }: ExerciseChartProps) => {
  const [chartData, setChartData] = useState<Promise<
    Schema<"WorkoutExerciseChartDataResponseDTO">["data"]
  > | null>(null);
  const waitingForResponse = useRef(false);

  const params = useParams();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<3 | 6 | 12>(3);

  useEffect(() => {
    if (
      waitingForResponse.current ||
      params.username === undefined ||
      params.name === undefined
    )
      return;

    waitingForResponse.current = true;
    const startDate = addMonths(new Date(), -selectedTimeFrame).toDateString();

    setChartData(
      sendAPIRequest(
        "/api/workout/{creator}/{name}/exercise-chart-data/{exerciseId}",
        {
          method: "get",
          parameters: {
            creator: params.username,
            name: params.name,
            exerciseId: exercise.id,
            startDate,
          },
        }
      ).then((x) => {
        waitingForResponse.current = false;
        if (x.code !== "OK") return [];

        return x.content.data;
      })
    );
  }, [params, exercise, selectedTimeFrame]);

  const dropdown = useMemo(
    () => (
      <Dropdown<{
        [key: string]: Timeframe;
      }>
        values={{
          "3 months": 3,
          "6 months": 6,
          "1 year": 12,
        }}
        onSelectionChanged={(_key, value) => setSelectedTimeFrame(value)}
      />
    ),
    []
  );

  return (
    <>
      {chartData && (
        <Async await={chartData}>
          {(chart) => (
            <div className="exercise-chart-container">
              <FocusTrap
                focusTrapOptions={{
                  allowOutsideClick: true,
                }}
              >
                <div className="exercise-chart-header">
                  <button className="close-btn">
                    <Icon name="xmark" />
                  </button>

                  <h3>{exercise.name}</h3>

                  <div className="exercise-chart-dropdown">{dropdown}</div>
                </div>
              </FocusTrap>

              <div className="exercise-chart">
                <LineChart
                  slots={{
                    mark: () => null,
                  }}
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
                    "& .MuiChartsAxisHighlight-root": {
                      stroke: "#fff",
                      strokeWidth: 1,
                      strokeDasharray: "10",
                    },
                  }}
                />
              </div>
            </div>
          )}
        </Async>
      )}
    </>
  );
});

export default ExerciseChart;
