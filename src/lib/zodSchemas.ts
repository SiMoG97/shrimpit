import * as z from "zod";

const urlWithoutHttpAndWWWRegex =
  "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$";

export const postFormSchema = z.object({
  destination: z
    .string()
    .regex(new RegExp(urlWithoutHttpAndWWWRegex), "Invalid URL"),
  title: z.string().optional(),
  customBackHalf: z
    .string()
    .max(16, { message: "Custom back-half is too long." })
    .optional(),
});
export type PostFormType = z.infer<typeof postFormSchema>;

export const putFormSchema = postFormSchema.extend({
  id: z.string().cuid(),
  destination: z
    .string()
    .regex(new RegExp(urlWithoutHttpAndWWWRegex), "Invalid URL")
    .optional(),
});
export type PutFormType = z.infer<typeof putFormSchema>;

export const deleteBodySchema = z.object({
  id: z.string().cuid(),
});

export type DeleteBodyType = z.infer<typeof deleteBodySchema>;

const urlParser = z.string().url();

export function getValidUrl(url: string) {
  if (!urlParser.safeParse(url).success) {
    return `http://${url}`;
  }
  return url;
}
