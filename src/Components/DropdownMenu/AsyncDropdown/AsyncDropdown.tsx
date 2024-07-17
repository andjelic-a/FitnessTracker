import { useState } from "react";
import Dropdown from "../Dropdown";
import DropdownItem from "../DropdownItem";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { SchemaNames } from "../../../Types/Endpoints/Endpoints";
import Async from "../../Async/Async";

type AsyncDropdownProps<T extends SchemaNames> = {
  placeholder: string;
  className?: string;
  onRequest: () => Promise<Schema<T>[]>;
  onSelectionChanged?: (key: string) => void;
};

export default function AsyncDropdown<T extends SchemaNames>({
  onRequest,
  placeholder,
  className,
  onSelectionChanged,
}: AsyncDropdownProps<T>) {
  const [data, setData] = useState<Promise<Schema<T>[]> | null>(null);

  return (
    <>
      {!data ? (
        <Dropdown
          placeholder={placeholder}
          className={className ?? ""}
          onOpen={() => setData(onRequest())}
          children={null}
        />
      ) : (
        <Async
          await={data}
          skeleton={
            <Dropdown
              placeholder={placeholder}
              className={className ?? ""}
              children={null}
            />
          }
        >
          {(resolvedData) => {
            if (!resolvedData) return null;

            return (
              <Dropdown
                placeholder={placeholder}
                className={className ?? ""}
                openOnStart
                onSelectionChanged={onSelectionChanged}
              >
                {resolvedData?.map((x) => (
                  <DropdownItem key={x.id}>{x.name}</DropdownItem>
                ))}
              </Dropdown>
            );
          }}
        </Async>
      )}
    </>
  );
}
