"use client";

import { type FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  postFormSchema,
  type PutFormType,
  type PostFormType,
  putFormSchema,
} from "@/lib/zodSchemas";
import { type ComponentProps, forwardRef } from "react";
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { type Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

type EditUrlFormT = {
  showInputs?: boolean;
  method?: "POST" | "PUT";
} & ComponentProps<"form">;

export default function EditUrlForm({
  showInputs = true,
  method = "POST",
  className,
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

  return (
    <div>
      <form
        className={`flex items-start gap-5 
        
         ${className}`}
        onSubmit={handleSubmit(submitHandler)}
      >
        <CustomInput
          id="destination"
          labelText={showInputs ? "Destination" : undefined}
          placeholder="https://www.exemple.com/"
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
        <CustomButton
          disabled={isSubmitting}
          className={`${showInputs ? "mt-6 self-end" : ""}`}
        >
          {updateButtonState(method, isSubmitting)}
        </CustomButton>
        {/* </div> */}
      </form>
    </div>
  );
}

function updateButtonState(method: "POST" | "PUT", isSubmitting: boolean) {
  if (method === "PUT") return isSubmitting ? "Updating..." : "Update";

  return isSubmitting ? "Shrimping..." : "New Shrimp";
}
