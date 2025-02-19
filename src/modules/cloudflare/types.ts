import { z } from "zod";

export const photoSchema = z.object({
  url: z.string().min(1, {
    message: "Image is required",
  }).default(""),
  title: z.string().default(""),
  description: z.string().default(""),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),

  country: z.string().optional().nullable(),
  countryCode: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),

  fullAddress: z.string().optional().nullable(),
  placeFormatted: z.string().optional().nullable(),
});

export type PhotoFormData = z.infer<typeof photoSchema>;
