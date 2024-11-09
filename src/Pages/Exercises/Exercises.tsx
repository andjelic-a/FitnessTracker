import "./Exercises.scss";
import { Link, useSearchParams } from "react-router-dom";
import { useRef } from "react";
import InputField from "../../Components/InputField/InputField";
import LazyLoadingContainer from "../../Components/LazyLoadingContainer/LazyLoadingContainer";

export default function Exercises() {
  let [searchParams, setSearchParams] = useSearchParams();
  const searchBarRef = useRef<HTMLInputElement>(null);

  function handleSearch() {
    setSearchParams((x) => {
      searchBarRef.current?.value
        ? x.set("name", searchBarRef.current.value)
        : x.delete("name");

      return x;
    });
  }

  return (
    <div className="exercises-page-container">
      <div className="filters-container">
        <InputField
          defaultValue={searchParams.get("name") ?? ""}
          placeholder="Search exercises..."
          iconName="search"
          inputRef={searchBarRef}
          onEnter={handleSearch}
        />
        <button onClick={handleSearch}>Filter</button>
      </div>

      <div className="exercises-container">
        <LazyLoadingContainer
          endpoint="/api/exercise"
          baseAPIRequest={{
            method: "get",
            parameters: {
              limit: 10,
              offset: 0,
            },
          }}
          onSegmentLoad={(segmentData) => {
            if (segmentData.code !== "OK") return;

            return segmentData.content.map((exercise) => (
              <Link
                className="exercise-card"
                to={exercise.id.toString()}
                key={exercise.id}
              >
                <p>{exercise.name}</p>
                <img src={exercise.image ?? ""} alt="" />
              </Link>
            ));
          }}
          stopCondition={(x) => x.code === "OK" && x.content.length < 10}
        />
      </div>
    </div>
  );
}
