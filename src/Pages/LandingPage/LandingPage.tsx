import Expander from "../../Components/Expander/Expander";
import ExpanderItem from "../../Components/Expander/ExpanderItem";
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
          alignItems: "center",
          marginTop: "5em",
          flexDirection: "column",
        }}
      >
        <Expander name="Expander">
          <ExpanderItem>Hello</ExpanderItem>
          <ExpanderItem>Hi</ExpanderItem>
          <ExpanderItem>Hello</ExpanderItem>
          <ExpanderItem>Hi</ExpanderItem>
          <ExpanderItem>Hello</ExpanderItem>
          <ExpanderItem>Hi</ExpanderItem>
        </Expander>

{/*         <Expander name="Expander 2">
          <ExpanderItem>Hello</ExpanderItem>
          <ExpanderItem>Hi</ExpanderItem>
          <ExpanderItem>Hello</ExpanderItem>
          <ExpanderItem>Hi</ExpanderItem>
        </Expander> */}
      </div>
    </>
  );
}

export default LandingPage;
