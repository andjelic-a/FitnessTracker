import { ReactNode, Suspense } from "react";
import { Await } from "react-router-dom";

type AsyncProps<T> = {
  await: Promise<T>;
  skeleton?: ReactNode;
  errorElement?: ReactNode;
  children: (data: unknown extends T ? any : T) => ReactNode;
};

export default function Async<T>({
  await: resolve,
  skeleton,
  errorElement,
  children,
}: AsyncProps<Awaited<T>>) {
  return (
    <Suspense fallback={skeleton ?? null}>
      <Await errorElement={errorElement} resolve={resolve}>
        {children}
      </Await>
    </Suspense>
  );
}
