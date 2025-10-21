import { z } from "zod";

export const blogSchema = z.object({

    title: z.string().min(2).max(100),
    content: z.string().min(10).max(10000),
    imageUrl: z.array(z.string().url()).optional(),
});

export const validateBlog = (data) => {
    return blogSchema.safeParse(data);
};
