import { z } from "zod";
export const jobFilterSchema = z.object({
  q: z.string().optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  remote: z.coerce.boolean().optional(), // should transform to boolean cause the form change every input to string
});
// export jobFilterSchema as types

export type JobFilterValues = z.infer<typeof jobFilterSchema>;
