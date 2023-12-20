import { type ReactNode } from "react";

type PropsT = {
  children: ReactNode;
};
export default function MainContainer({ children }: PropsT) {
  return <main className="mx-auto w-full max-w-3xl px-5 py-5">{children}</main>;
}
