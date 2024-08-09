import "./WorkoutCarousel.scss";
import { ReactNode } from "react";

import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

type WorkoutCarouselProps = {
  children: ReactNode;
  className?: string;
};

export default function WorkoutCarousel({
  children,
  className,
}: WorkoutCarouselProps) {
  return (
    <OverlayScrollbarsComponent
      className={
        "workout-carousel-scroll-container" + (className ? " " + className : "")
      }
      options={{
        scrollbars: {
          autoHide: "leave",
          autoHideDelay: 100,
          theme: "os-theme-light",
        },
        overflow: {
          x: "scroll",
          y: "hidden",
        },
      }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
