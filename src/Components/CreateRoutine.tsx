import { useRef, useEffect } from "react";

interface CreateRoutineProps {
  isNewWindowOpen: boolean;
  setIsNewWindowOpen: (isOpen: boolean) => void;
}

export default function CreateRoutine({ isNewWindowOpen, setIsNewWindowOpen }: CreateRoutineProps) {
  const excludedDivRef = useRef<HTMLDivElement | null>(null);
  const routinTitleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (excludedDivRef.current && !excludedDivRef.current.contains(event.target as Node)) {
        setIsNewWindowOpen(false);
        if (routinTitleRef.current) {
          routinTitleRef.current.value = "";
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsNewWindowOpen]);

  return (
    <div
      ref={excludedDivRef}
      className={`profile-workouts-new ${
        isNewWindowOpen ? "new-window-open" : ""
      }`}
    >
      <div className="profile-workouts-new-header">
        <input ref={routinTitleRef} type="text" id="routine-title" placeholder="Routine title" maxLength={25} />
        <button className="profile-workouts-new-save">Save</button>
      </div>
    </div>
  );
}
