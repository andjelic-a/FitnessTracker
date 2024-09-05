import { memo, useEffect, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Pin from "./Pin";
import "./Pins.scss";
import Async from "../Async/Async";
import sendAPIRequest from "../../Data/SendAPIRequest";
import ReactModal from "react-modal";
import Icon from "../Icon/Icon";

type PinsProps = {
  pins: Schema<"SimplePinResponseDTO">[];
};

const Pins = memo<PinsProps>(({ pins }) => {
  const [pinOptionsPromise, setPinOptionsPromise] = useState<Promise<
    Schema<"SimplePinOptionResponseDTO">[]
  > | null>(null);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  const [selectedPins, setSelectedPins] = useState<
    {
      id: string;
      type: number;
    }[]
  >([]);
  const isWaitingForResponse = useRef(false);

  useEffect(
    () =>
      void setSelectedPins(
        pins.map((x) => ({
          id: x.id,
          type: x.type,
        }))
      ),
    [pins]
  );

  return (
    <div className="pins-container">
      <div className="pins-header">
        <h1>Pins</h1>
        <button
          onClick={() => {
            setIsOptionsMenuOpen(!isOptionsMenuOpen);

            if (!pinOptionsPromise)
              setPinOptionsPromise(
                sendAPIRequest("/api/user/me/pins/options", {
                  method: "get",
                }).then((x) => (x.code === "OK" ? x.content : []))
              );
          }}
        >
          Customize your pins
        </button>
      </div>

      <div className="pins-body">
        {pins.map((x) => (
          <Pin key={x.id} pin={x} />
        ))}
      </div>

      <ReactModal
        isOpen={isOptionsMenuOpen}
        onRequestClose={() => setIsOptionsMenuOpen(false)}
        className={{
          afterOpen: "open",
          base: "pins-options-menu-container",
          beforeClose: "closing",
        }}
        overlayClassName="overlay-modal"
        portalClassName="modal-portal"
        closeTimeoutMS={200}
      >
        <div className="pins-options-menu-header">
          <h1>Edit pinned items</h1>
        </div>

        <div className="pins-options-menu-body">
          <div className="info-section">
            <p>
              Select up to six public workouts or splits you'd like to show to
              anyone.
            </p>
          </div>

          <Async await={pinOptionsPromise ?? Promise.resolve([])}>
            {(options) =>
              options.map((x) => (
                <div
                  className="option"
                  key={x.name + "-" + x.type}
                  onClick={() => {
                    if (selectedPins.findIndex((y) => x.id === y.id) < 0)
                      setSelectedPins([
                        ...selectedPins,
                        {
                          id: x.id,
                          type: x.type,
                        },
                      ]);
                    else
                      setSelectedPins(
                        selectedPins.filter((y) => x.id !== y.id)
                      );
                  }}
                >
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      name={`${x.name}-${x.type}`}
                      id={`${x.name}-${x.type}`}
                      checked={
                        selectedPins.findIndex((y) => x.id === y.id) >= 0
                      }
                      readOnly
                    />

                    <label htmlFor={`${x.name}-${x.type}`}>{x.name}</label>
                  </div>

                  <div className="like-count-container">
                    <p>{x.likeCount}</p>
                    <Icon name="thumbs-up" />
                  </div>
                </div>
              ))
            }
          </Async>
        </div>

        <button
          className="save-button"
          onClick={() => {
            if (isWaitingForResponse.current) return;
            isWaitingForResponse.current = true;

            const promises: Promise<any>[] = [];

            pins.forEach((pin) => {
              if (selectedPins.findIndex((x) => x.id === pin.id) >= 0) return; //'Pin' is still selected

              //User unselected/deleted the pin
              promises.push(
                sendAPIRequest(
                  `/api/user/pins/${pin.type === 0 ? "workout" : "split"}/{id}`,
                  {
                    method: "delete",
                    parameters: {
                      id: pin.id,
                    },
                  }
                )
              );
            });

            selectedPins.forEach((pin) => {
              if (pins.findIndex((x) => x.id === pin.id) >= 0) return; //'Pin' was selected by default

              //User selected a new pin
              promises.push(
                sendAPIRequest(
                  `/api/user/pins/${pin.type === 0 ? "workout" : "split"}/{id}`,
                  {
                    method: "post",
                    parameters: {
                      id: pin.id,
                    },
                  }
                )
              );
            });

            Promise.all(promises).then(() => {
              isWaitingForResponse.current = false;
              setIsOptionsMenuOpen(false);
            });
          }}
        >
          Save
        </button>
      </ReactModal>
    </div>
  );
});

export default Pins;
