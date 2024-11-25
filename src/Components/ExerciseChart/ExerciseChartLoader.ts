import { redirect } from "react-router-dom";
import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { getNameFromURLParam } from "../../Utility/FormatURLNameParam";

const exerciseChartLoader = createLoader(
  ({ params: { exerciseId, name, username } }) => {
    if (!exerciseId || !name || !username) return redirect("/");

    return {
      chartData: sendAPIRequest(
        "/api/workout/{creator}/{name}/mock-exercise-chart-data/{exerciseId}",
        {
          method: "get",
          parameters: {
            creator: username,
            name: getNameFromURLParam(name),
            exerciseId: +exerciseId,
          },
        }
      ),
    };
  },
  ":username/workout/:name/:exerciseId/chart"
);

export default exerciseChartLoader;
