"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FormType, formSchema } from "@/lib/formSchema";
import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { type Session } from "next-auth";

type EditUrlFormT = {
  showInputs?: boolean;
};

export default function EditUrlForm({ showInputs = true }: EditUrlFormT) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async (data: FormType) => {
    try {
      await fetch("/api/shortUrl", {
        method: "POST",
        body: JSON.stringify(data),
      });
      reset();
      if (showInputs) {
        router.push("/dashboard");
      }

      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <CustomInput
        id="destination"
        labelText="Destination"
        errorMessage={errors?.destination?.message}
        {...register("destination")}
      />
      {showInputs && (
        <>
          <CustomInput
            id="title"
            labelText="Title (optional)"
            errorMessage={errors?.title?.message}
            {...register("title")}
          />
          <CustomInput
            id="customBackHalf"
            labelText="Custom back-half (optional)"
            errorMessage={errors?.customBackHalf?.message}
            {...register("customBackHalf")}
          />
        </>
      )}
      <button disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Create one"}
      </button>
    </form>
  );
}

type InputProps = {
  id: string;
  labelText: string;
  placeholder?: string;
  errorMessage?: string;
};

const CustomInput = forwardRef<HTMLInputElement, InputProps>(function (
  { id, labelText, placeholder, errorMessage, ...rest },
  ref,
) {
  return (
    <div>
      <label htmlFor={id}>{labelText}</label>
      <input
        type="text"
        id={id}
        ref={ref}
        placeholder={placeholder}
        className="border-2 border-solid border-black"
        {...rest}
      />
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
});

CustomInput.displayName = "CustomInput";
