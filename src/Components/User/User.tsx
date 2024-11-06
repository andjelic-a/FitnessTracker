import "./User.scss";
import { useNavigate } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { useContext } from "react";
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";

type UserProps = {
  user: Schema<"SimpleUserResponseDTO">;
};

export default function User({ user: { username, name, image } }: UserProps) {
  const navigate = useNavigate();
  const basicInfo = useContext(basicProfileInfoContext);

  return (
    <div
      className="user-container"
      onClick={(e) => {
        e.preventDefault();

        if (basicInfo?.username !== username) navigate(`/user/${username}`);
        else navigate("/me");
      }}
    >
      <img
        src={image ?? "/DefaultProfilePicture.png"}
        alt={`Profile picture of a user named ${name}`}
      />
      <p>{name}</p>
    </div>
  );
}
