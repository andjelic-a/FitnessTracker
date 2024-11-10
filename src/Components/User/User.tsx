import "./User.scss";
import { useNavigate } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";

type UserProps = {
  user: Schema<"SimpleUserResponseDTO">;
};

export default function User({ user: { username, name, image } }: UserProps) {
  const navigate = useNavigate();

  return (
    <a
      className="user-container"
      onClick={(e) => {
        e.preventDefault();
        sessionStorage.setItem("revalidate-profile", "true");
        navigate(`/${username}`);
      }}
    >
      <img
        src={image ?? "/DefaultProfilePicture.png"}
        alt={`Profile picture of a user named ${name}`}
      />
      <p>{name}</p>
    </a>
  );
}
