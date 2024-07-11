import "./RoutineItem.scss";
import { useEffect, useRef, MutableRefObject } from "react";
import Icon from "../../../Icon/Icon.tsx";
import Observer from "gsap/Observer";
import { PossibleSetIcon, Set } from "./RoutineItem.tsx";

type SingleExerciseSetProps = {
  set: Set;
  onSetChanged: (newSet: Set) => void;
  index: number;
  dropDownMenuWrapper?: MutableRefObject<(HTMLDivElement | null)[]>;
  onSetClick?: (id: string) => void;
  onDeleteSet?: (id: string) => void;
  onChangeSetIcon?: (id: string, icon: PossibleSetIcon) => void;
  onDragStart?: (ref: HTMLDivElement) => void;
  onDragEnd?: (ref: HTMLDivElement) => void;
  onMouseOver?: (ref: HTMLDivElement) => void;
};

/**
 * Renders a single exercise set component with options to click, delete, and change the set icon.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.set - The exercise set object containing the set data.
 * @param {number} props.index - The index of the set in the list of sets.
 * @param {MutableRefObject<(HTMLDivElement | null)[]>} props.dropDownMenuWrapper - Optional reference to the react RefObject of HTMLDivElement[] which represents the dropdown menus of all sets.
 * @param {Function} props.onSetClick - Optional callback function to be called when the set is clicked.
 * @param {Function} props.onDeleteSet - Optional callback function to be called when the set is deleted.
 * @param {Function} props.onChangeSetIcon - Optional callback function to be called when the set icon is changed.
 * @param {Function} props.onDragEnd - Optional callback function to be called when the set dragging ends.
 * @param {Function} props.onDragStart - Optional callback function to be called when the set is dragging starts.
 * @param {Function} props.onMouseOver - Optional callback function to be called when the mouse hovers over the set.
 * @return {JSX.Element} The single exercise set component.
 */
export default function RoutineSetDisplay({
  set,
  index,
  dropDownMenuWrapper,
  onSetClick,
  onDeleteSet,
  onChangeSetIcon,
  onDragEnd,
  onDragStart,
  onMouseOver,
  onSetChanged,
}: SingleExerciseSetProps): JSX.Element {
  const setWrapperRef = useRef<HTMLDivElement>(null);

  const onMouseOverCallbackRef = useRef<
    ((ref: HTMLDivElement) => void) | undefined
  >(undefined);

  useEffect(
    () => void (onMouseOverCallbackRef.current = onMouseOver),
    [onMouseOver]
  );

  useEffect(() => {
    const observer = Observer.create({
      target: setWrapperRef.current,
      type: "touch,pointer",
      preventDefault: true,
      dragMinimum: 10,
      onDragStart: () => {
        if (setWrapperRef.current) onDragStart?.(setWrapperRef.current);
      },
      onDragEnd: () => {
        if (setWrapperRef.current) onDragEnd?.(setWrapperRef.current);
      },
      onHover: (x) => {
        onMouseOverCallbackRef.current?.(x.target as HTMLDivElement);
      },
    });

    return () => observer.kill();
  }, [setWrapperRef]);

  return (
    <div
      className="exercise-set-item"
      ref={setWrapperRef}
      id={`exercise-set-item-${set.id}`}
    >
      <div className="set-button">
        <p onClick={() => onSetClick?.(set.id)}>
          {set.selectedIcon ? (
            <Icon className="set-icon" name={set.selectedIcon} />
          ) : (
            set.set
          )}
        </p>
        <div
          ref={(element) =>
            dropDownMenuWrapper
              ? (dropDownMenuWrapper.current[index] = element)
              : void element
          }
          className={`set-dropdown-menu ${!set.isDropdownOpen ? "hidden" : ""}`}
        >
          <span>
            <Icon
              onClick={() => onChangeSetIcon?.(set.id, "1")}
              className="set-icon"
              name="1"
            />
          </span>
          <span>
            <div onClick={() => onChangeSetIcon?.(set.id, "w")}>Warmup</div>
          </span>
          <span>
            <div onClick={() => onChangeSetIcon?.(set.id, "d")}>Drop set</div>
          </span>
          <span>
            <div onClick={() => onChangeSetIcon?.(set.id, "f")}>Failure</div>
          </span>
          <span>
            <Icon
              onClick={() => onDeleteSet?.(set.id)}
              className="set-icon x"
              name="xmark"
            />
          </span>
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder={set.rir.toString()}
          maxLength={4}
          onChange={(e) => onSetChanged?.({ ...set, rir: +e.target.value })}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder={set.repRange}
          maxLength={4}
          onChange={(e) => onSetChanged?.({ ...set, repRange: e.target.value })}
        />
      </div>
    </div>
  );
}