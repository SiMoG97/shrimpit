"use client";
import { forwardRef, type ComponentProps } from "react";

type InputProps = {
  labelText?: string;
  errorMessage?: string;
} & ComponentProps<"input">;

// export default function CustomInput({
//   labelText,
//   errorMessage,
//   id,
//   ref,
//   ...props
// }: InputProps) {
//   return (
//     <div className="w-full">
//       {labelText ? (
//         <label className=" my-1 block text-xl" htmlFor={id}>
//           {labelText}
//         </label>
//       ) : null}
//       <input
//         id={id}
//         className="block w-full border-4 border-black px-2 py-1"
//         ref={ref}
//         {...props}
//       />
//       {errorMessage ? <p className="text-red-400">{errorMessage}</p> : null}
//     </div>
//   );
// }

const CustomInput = forwardRef<HTMLInputElement, InputProps>(function (
  { id, labelText, errorMessage, ...props },
  ref,
) {
  return (
    <div className="relative w-full pb-1">
      {labelText ? (
        <label className="block text-xl" htmlFor={id}>
          {labelText}
        </label>
      ) : null}
      <input
        id={id}
        className="block w-full border-4 border-black px-2 py-1 text-xl"
        ref={ref}
        {...props}
      />
      {errorMessage ? (
        <p className="absolute bottom-[-20px] text-red-400">{errorMessage}</p>
      ) : null}
    </div>
  );
});

CustomInput.displayName = "CustomInput";
export default CustomInput;
