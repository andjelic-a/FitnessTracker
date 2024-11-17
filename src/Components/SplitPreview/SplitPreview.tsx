import { Link } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { HTMLProps } from "../../Types/Utility/HTMLProps";
import User from "../User/User";
import "./SplitPreview.scss";

type SplitPreviewDisplayProps = {
  split: Schema<"SimpleSplitResponseDTO">;
  headerProps?: HTMLProps<HTMLDivElement>;
  bodyProps?: HTMLProps<HTMLDivElement>;
  footerProps?: HTMLProps<HTMLDivElement>;
} & HTMLProps<HTMLDivElement>;

export default function SplitPreview({
  split,
  className,
  headerProps,
  bodyProps,
  footerProps,
  ...attr
}: SplitPreviewDisplayProps) {
  return (
    <div className={"split-preview " + (className ? className : "")} {...attr}>
      <div className="split-preview-header" {...headerProps}>
        <Link
          className="split-preview-preview-header-name"
          to={`/${split.creator.username}/workout/${split.name}`}
        >
          {split.name}
        </Link>
      </div>

      <div className="split-preview-footer" {...footerProps}>
        <User user={split.creator} />
      </div>
    </div>
  );
}
