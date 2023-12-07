import { type ReactNode } from "react";

type PropsT = {
  children: ReactNode;
};
export default function MainContainer({ children }: PropsT) {
  return <main className="container mx-auto bg-slate-300">{children}</main>;
}
