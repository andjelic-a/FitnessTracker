import InfoCard from "../../Components/InfoCard/InfoCard";
import "./LandingPage.scss";

function LandingPage() {
  return (
    <>
      <h1
        style={{
          marginTop: "1em",
          textAlign: "center",
        }}
      >
        Landing Page <InfoCard>{`##Hello\nThis is a landing /*page*/`}</InfoCard>
      </h1>
    </>
  );
}

export default LandingPage;
 