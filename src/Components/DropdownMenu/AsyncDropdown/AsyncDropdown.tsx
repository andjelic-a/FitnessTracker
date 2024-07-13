import { Suspense, useState } from "react";
import Dropdown from "../Dropdown";
import { Await } from "react-router-dom";
import DropdownItem from "../DropdownItem";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { SchemaNames } from "../../../Types/Endpoints/Endpoints";

type AsyncDropdownProps<T extends SchemaNames> = {
  placeholder: string;
  className?: string;
  onRequest: () => Promise<Schema<T>[]>;
};

export default function AsyncDropdown<T extends SchemaNames>({
  onRequest,
  placeholder,
  className,
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
        <Suspense
          fallback={
            <Dropdown
              placeholder={placeholder}
              className={className ?? ""}
              children={null}
            />
          }
        >
          <Await resolve={data}>
            {(resolvedData: Awaited<typeof data>) => {
              if (!resolvedData) return null;

              return (
                <Dropdown
                  placeholder={placeholder}
                  className={className ?? ""}
                  openOnStart
                >
                  {resolvedData?.map((x) => (
                    <DropdownItem key={x.id}>{x.name}</DropdownItem>
                  ))}
                </Dropdown>
              );
            }}
          </Await>
        </Suspense>
      )}
    </>
  );
}
