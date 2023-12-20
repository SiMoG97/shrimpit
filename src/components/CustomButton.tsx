import { type ComponentProps } from "react";

type ButtonProps = {
  variant?: "primary" | "danger";
  className?: string;
} & ComponentProps<"button">;

export default function CustomButton({
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`min-w-fit border-4 border-black  bg-white px-8 py-1 text-center text-xl  shadow-[3px_3px_0_rgb(0,0,0)]  shadow-black hover:bg-gray-100 active:bg-gray-300 active:shadow-[0_0_0_rgb(0,0,0)] disabled:pointer-events-none disabled:border-gray-400 disabled:bg-white disabled:text-gray-400 disabled:shadow-gray-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
