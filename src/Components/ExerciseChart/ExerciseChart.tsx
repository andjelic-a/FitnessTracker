import "./ExerciseChart.scss";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import Async from "../Async/Async";
import WindowFC from "../WindowWrapper/WindowFC";
import exerciseChartLoader from "./ExerciseChartLoader";
import { LineChart } from "@mui/x-charts";

const ExerciseChart = WindowFC(() => {
  const loaderData = useLoaderData<typeof exerciseChartLoader>();

  return (
    <Async await={loaderData?.chartData}>
      {(response) => {
        if (response.code !== "OK") return null;
        const chart = response.content.data.slice(
          response.content.data.length - 30
        );

        return (
          <div className="chart-container">
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
                },
              ]}
            />
          </div>
        );
      }}
    </Async>
  );
});

export default ExerciseChart;
