import * as z from "zod";

export const postFormSchema = z.object({
  destination: z.string().url(),
  title: z.string().optional(),
  customBackHalf: z
    .string()
    .max(16, { message: "Custom back-half is too long." })
    .optional(),
});
export type PostFormType = z.infer<typeof postFormSchema>;

export const putFormSchema = postFormSchema.extend({
  id: z.string().cuid(),
  destination: z.string().url().optional(),
});
export type PutFormType = z.infer<typeof putFormSchema>;

export const deleteBodySchema = z.object({
  id: z.string().cuid(),
});

export type DeleteBodyType = z.infer<typeof deleteBodySchema>;
