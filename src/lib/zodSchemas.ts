import * as z from "zod";

export const formSchema = z.object({
  destination: z.string().url(),
  title: z.string().optional(),
  customBackHalf: z
    .string()
    .max(16, { message: "Custom back-half is too long." })
    .optional(),
});
export type FormType = z.infer<typeof formSchema>;

export const deleteBodySchema = z.object({
  id: z.string().cuid(),
});

export type DeleteBodyType = z.infer<typeof deleteBodySchema>;
