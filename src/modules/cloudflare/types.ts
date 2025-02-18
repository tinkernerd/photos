import { z } from "zod";
import { photosUpdateSchema } from "@/db/schema";

export const photoFormSchema = photosUpdateSchema;
export type PhotoFormValues = z.infer<typeof photoFormSchema>;
