import { useContext, useState, useMemo } from "react";
import WorkoutItem, {
  WorkoutItemData,
} from "../CreateWorkout/WorkoutItem/WorkoutItem";
import { DndContext } from "@dnd-kit/core";
import CurrentEditingWorkoutSetsContext from "../../Contexts/CurrentEditingWorkoutSetsContext";
import ExerciseSelector from "../CreateWorkout/ChooseExercise/ExerciseSelector";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { v4 } from "uuid";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";

type WorkoutSetCreatorProps = {
  onOverlayOpen: () => void;
  onOverlayClose: () => void;
};

export default function WorkoutSetCreator({
  onOverlayOpen,
  onOverlayClose,
}: WorkoutSetCreatorProps) {
  const [isChoosingExercise, setIsChoosingExercise] = useState<boolean>(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(
    null
  );

  /*   useEffect(() => {
    //Sort data according to their respective elements
    fuckYou();
  }, [createdSets]); */

  /*   function fuckYou() {
    const idToIndexMap = new Map<string, number>();
    createdSets.forEach((item, index) => {
      idToIndexMap.set(item.id, index);
    });

    createdSetsRef.current.sort((a, b) => {
      const indexA = idToIndexMap.get(a.id);
      const indexB = idToIndexMap.get(b.id);

      if (indexA !== undefined && indexB !== undefined) {
        return indexA - indexB;
      }

      return 0;
    });
    onSetsChange(createdSetsRef.current);
  }
 */

  function handleAddExerciseSetBtnClick() {
    onOverlayOpen();
    setIsChoosingExercise(true);
  }

  const handleExerciseChosen = (
    selected:
      | Schema<"SimpleExerciseResponseDTO">
      | Schema<"SimpleExerciseResponseDTO">[]
  ) => {
    onOverlayClose();

    if (!replacingExerciseId && Array.isArray(selected)) {
      currentSetsContext.setCurrentSets((prevState) => [
        ...(prevState ?? []),
        ...selected.map<WorkoutItemData>((x) => ({
          exercise: x,
          id: v4(),
          sets: [
            {
              id: v4(),
              idx: 0,
              isDropdownOpen: false,
              repRange: "0",
              rir: -1,
              type: "1",
            },
          ],
        })),
      ]);
      return;
    }

    setReplacingExerciseId(null);
    currentSetsContext.setCurrentSets((prev) => {
      const index = prev.findIndex((x) => x.id === replacingExerciseId);
      if (index >= 0 && !Array.isArray(selected))
        prev[index].exercise = selected;

      return prev.slice();
    });
  };

  function handleReplaceExerciseRequest(id: string) {
    onOverlayOpen();
    setIsChoosingExercise(true);
    setReplacingExerciseId(id);
  }

  const currentSetsContext = useContext(CurrentEditingWorkoutSetsContext);

  const exerciseSelectorPortalNode = useMemo(() => createHtmlPortalNode(), []);
  const exerciseSelectorMemo = useMemo(
    () => (
      <ExerciseSelector
        onClose={() => {
          setIsChoosingExercise(false);
          setReplacingExerciseId(null);
        }}
        onConfirmSelection={handleExerciseChosen}
        singleMode={!!replacingExerciseId}
      />
    ),
    [replacingExerciseId, handleExerciseChosen]
  );

  return (
    <>
      <InPortal
        node={exerciseSelectorPortalNode}
        children={exerciseSelectorMemo}
      />

      {isChoosingExercise && <OutPortal node={exerciseSelectorPortalNode} />}

      <DndContext
        onDragEnd={(x) => {
          console.log(x);
        }}
      >
        <div className="set-creator-container">
          {currentSetsContext.currentSets.map((x) => (
            <WorkoutItem
              key={x.id}
              workoutItem={x}
              onRequestExerciseReplace={handleReplaceExerciseRequest}
            />
          ))}

          {/* <Droppable id="droppable-1" /> */}

          {/* <Draggable id="draggable-1" /> */}

          <button
            onClick={handleAddExerciseSetBtnClick}
            className="add-exercise-btn"
          >
            Add exercise
          </button>
        </div>
      </DndContext>
    </>
  );
}
