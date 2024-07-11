import Expander from "../../Components/Expander/Expander";
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
        Landing Page
        <InfoCard>{`##Hello\nThis is a landing /*page*/`}</InfoCard>
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "5em",
        }}
      >
        <Expander name="Expander">
          <p>Hello</p>
          <p>Hi</p>
          <p>Hey</p>
        </Expander>
      </div>
    </>
  );
}

export default LandingPage;
