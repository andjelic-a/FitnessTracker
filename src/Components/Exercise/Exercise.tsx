import "./Exercise.scss";

type ExerciseProps = {
    isOpen: boolean;
}

export default function Exercise({isOpen}: ExerciseProps) {
    return <div className={`exercise ${isOpen ? "exercise-open" : ""}`}>
    </div>;
}