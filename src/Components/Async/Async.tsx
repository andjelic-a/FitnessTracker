import { ReactNode, Suspense } from "react";
import { Await } from "react-router-dom";

type AsyncProps<T> = {
  await: Promise<T>;
  children: (data: unknown extends T ? any : T) => ReactNode;
};

export default function Async<T>({
  await: resolve,
  children,
}: AsyncProps<Awaited<T>>) {
  return (
    <Suspense>
      <Await resolve={resolve}>{children}</Await>
    </Suspense>
  );
}
