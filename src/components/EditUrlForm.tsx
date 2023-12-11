"use client";

import { type FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  postFormSchema,
  type PutFormType,
  type PostFormType,
  putFormSchema,
} from "@/lib/zodSchemas";
import { forwardRef } from "react";
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { type Session } from "next-auth";
import { useSearchParams } from "next/navigation";

type EditUrlFormT = {
  showInputs?: boolean;
  method?: "POST" | "PUT";
};

export default function EditUrlForm({
  showInputs = true,
  method = "POST",
}: EditUrlFormT) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PostFormType | PutFormType>({
    defaultValues: {
      id: searchParams.get("id") ?? undefined,
      destination: searchParams.get("destination") ?? undefined,
      title: searchParams.get("title") ?? undefined,
      customBackHalf: searchParams.get("customBackHalf") ?? undefined,
    },
    resolver: zodResolver(method === "POST" ? postFormSchema : putFormSchema),
  });

  const submitHandler = async (data: PostFormType | PutFormType) => {
    try {
      const res = await fetch("/api/shortUrl", {
        method: method,
        body: JSON.stringify(data),
      });
      if (!res.ok && res.status == 409) {
        throw new Error("Custom back-half already taken");
      }
      if (!res.ok) throw new Error(await res.text());

      reset();
      if (showInputs) {
        router.push("/dashboard");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      if (!(error instanceof Error)) return;

      setError(
        "customBackHalf",
        {
          type: "coflictBackHalf",
          message: error.message,
        },
        { shouldFocus: true },
      );
    }
  };
  // const errorHandler = (errors: FieldErrors<FormType>) => {
  //   console.log("from error handler");
  //   console.log(errors);
  // };

  // console.log(errors);
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
      <SubmitButton isSubmitting={isSubmitting} method={method} />
    </form>
  );
}

type SubmitBtnT = {
  isSubmitting: boolean;
  method?: "POST" | "PUT";
};
function SubmitButton({ isSubmitting, method }: SubmitBtnT) {
  if (method === "PUT") {
    return (
      <button disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update"}
      </button>
    );
  }

  return (
    <button disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Create one"}
    </button>
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
