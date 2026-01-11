import { z } from "zod";

const createPostValidationSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(10),
  thumbnail: z.string().url().optional(),
  isFeatured: z.boolean().default(false).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED").optional(),
  tags: z.array(z.string()).default([]).optional(),
});

const updatePostValidationSchema = createPostValidationSchema.partial();

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
