import * as z from "zod";

export const formSchema = z.object({
  destination: z.string().url(),
  title: z.string().optional(),
  customBackHalf: z.string().optional(),
});
export type FormType = z.infer<typeof formSchema>;
