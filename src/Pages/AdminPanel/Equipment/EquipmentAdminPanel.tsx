import { useRef } from "react";
import useLoaderData from "../../../BetterRouter/UseLoaderData";
import Async from "../../../Components/Async/Async";
import InputField from "../../../Components/InputField/InputField";
import adminEquipmentLoader from "./EquipmentAdminPanelLoader";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import { useNavigate } from "react-router-dom";
import Icon from "../../../Components/Icon/Icon";

export default function EquipmentAdminPanel() {
  const loaderData = useLoaderData<typeof adminEquipmentLoader>();
  const newEquipmentInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function handleCreate() {
    if (!newEquipmentInputRef.current || !newEquipmentInputRef.current.value)
      return;

    sendAPIRequest("/api/equipment", {
      method: "post",
      payload: {
        name: newEquipmentInputRef.current.value,
      },
    }).then(() => void navigate(0));
  }

  return (
    <Async await={loaderData.equipment}>
      {(equipment) => {
        if (equipment.code !== "OK") return null;

        return (
          <div>
            <h1>Equipment</h1>
            <InputField
              onEnter={handleCreate}
              inputRef={newEquipmentInputRef}
              placeholder="New Equipment"
            />
            <button onClick={handleCreate}>Create</button>

            {equipment.content.map((equipment) => (
              <div
                key={equipment.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: "1.5rem",
                }}
              >
                <p>{equipment.name}</p>
                <Icon
                  className="icon"
                  name="trash"
                  onClick={() => {
                    void sendAPIRequest(`/api/equipment/{id}`, {
                      method: "delete",
                      parameters: {
                        id: equipment.id,
                      },
                    });

                    void navigate(0);
                  }}
                />
              </div>
            ))}
          </div>
        );
      }}
    </Async>
  );
}
