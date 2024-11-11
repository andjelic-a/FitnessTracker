import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <div className={"split-preview " + (className ? className : "")} {...attr}>
      <div className="header" {...headerProps}>
        <p
          className="name"
          onClick={() =>
            navigate(`/${split.creator.username}/split/${split.name}`)
          }
        >
          {split.name}
        </p>
      </div>

      <div className="footer" {...footerProps}>
        <User user={split.creator} />
      </div>
    </div>
  );
}
