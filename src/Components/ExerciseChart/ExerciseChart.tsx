import "./ExerciseChart.scss";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import Async from "../Async/Async";
import WindowFC from "../WindowWrapper/WindowFC";
import exerciseChartLoader from "./ExerciseChartLoader";
import Dropdown from "../DropdownMenu/Dropdown";
import { LineChart } from "@mui/x-charts";

const ExerciseChart = WindowFC(() => {
  const loaderData = useLoaderData<typeof exerciseChartLoader>();

  return (
    <Async await={loaderData?.chartData}>
      {(response) => {
        if (response?.code !== "OK") return null;
        const chart = response.content.data.slice(
          response.content.data.length - 30
        );

        return (
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
          </div>
        );
      }}
    </Async>
  );
});

export default ExerciseChart;
