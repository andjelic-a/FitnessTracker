import useLoaderData from "../../BetterRouter/UseLoaderData";
import Async from "../../Components/Async/Async";
import InfoCard from "../../Components/InfoCard/InfoCard";
import "./LandingPage.scss";
import landingPageLoader from "./LandingPageLoader";

function LandingPage() {
  const loaderData = useLoaderData<typeof landingPageLoader>();

  return (
    <>
      <h1
        style={{
          marginTop: "1em",
          textAlign: "center",
        }}
      >
        Landing Page
        <InfoCard>{`##Hello\nThis is a landing /*page*/`}</InfoCard>
      </h1>

      <Async await={loaderData.exercises}>
        {(exercises) => {
          if (exercises.code !== "OK") return null;

          return exercises.content.map((x) => <p>{x.name}</p>);
        }}
      </Async>
    </>
  );
}

export default LandingPage;
