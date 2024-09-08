import "./User.scss";
import { useNavigate } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";

type UserProps = {
  user: Schema<"SimpleUserResponseDTO">;
};

export default function User({ user: { id, name, image } }: UserProps) {
  const navigate = useNavigate();

  return (
    <div
      className="user-container"
      onClick={(e) => {
        e.preventDefault();
        navigate(`/user/${id}`);
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
