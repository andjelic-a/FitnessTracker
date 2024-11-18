import { Link } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { HTMLProps } from "../../Types/Utility/HTMLProps";
import User from "../User/User";
import "./MiniPreview.scss";

type MiniPreviewDisplayProps = {
  data: Schema<"SimpleSplitResponseDTO"> | Schema<"SimpleWorkoutResponseDTO">;
  type: 'split' | 'workout';
  headerProps?: HTMLProps<HTMLDivElement>;
  bodyProps?: HTMLProps<HTMLDivElement>;
  footerProps?: HTMLProps<HTMLDivElement>;
  day?: string;
} & HTMLProps<HTMLDivElement>;

export default function MiniPreview({
  data,
  type,
  className,
  headerProps,
  bodyProps,
  footerProps,
  day,
  ...attr
}: MiniPreviewDisplayProps) {
  return (
    <div className={"mini-preview " + (className ? className : "")} {...attr}>
      <div className="mini-preview-header" {...headerProps}>
        <Link
          className="mini-preview-preview-header-name"
          to={`/${data.creator.username}/${ type === "split" ? 'split' : 'workout'}/${data.name}`}
        >
          {data.name}
        </Link>

        <p className="mini-preview-header-day">{day}</p>
      </div>

      <div className="mini-preview-footer" {...footerProps}>
        <User user={data.creator} />
      </div>
    </div>
  );
}
