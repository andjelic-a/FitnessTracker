import "./User.scss";
import { useNavigate } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { getProfileCache } from "../../Pages/Profile/ProfileCache";

type UserProps = {
  user: Schema<"SimpleUserResponseDTO">;
};

export default function User({ user: { username, name, image } }: UserProps) {
  const navigate = useNavigate();

  return (
    <div
      className="user-container"
      onClick={(e) => {
        e.preventDefault();
        getProfileCache()?.user.then((user) => {
          if (user.code !== "OK" || user.content.username !== username)
            navigate(`/user/${username}`);
          else navigate("/me");
        });
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
