"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { travelBlogSchema } from "@/lib/validations";
import slugify from "slugify";
import { z } from "zod";

// Check if slug already exists and generate unique one
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await client.fetch(
      `*[_type == "travelblogs" && slug.current == $slug][0]`,
      { slug }
    );

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export const createTravelBlog = async (state: any, form: FormData) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const { title, description, category, image, post } = Object.fromEntries(form);

  try {
    const travelBlog = {
      title,
      description,
      category,
      image,
      post,
    };

    // Validate with Zod
    await travelBlogSchema.parseAsync(travelBlog);

    // Generate unique slug
    const baseSlug = slugify(title as string, { lower: true, strict: true });
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    const result = await writeClient.create({
      _type: "travelblogs",
      title,
      slug: {
        _type: "slug",
        current: uniqueSlug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      description,
      category,
      image,
      post: post,
      views: 0,
    });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.reduce((acc, issue) => {
        const field = issue.path[0];
        acc[field] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return parseServerActionResponse({
        error: "Validation failed",
        status: "ERROR",
        issues: fieldErrors,
      });
    }

    return parseServerActionResponse({
      error: "Something went wrong",
      status: "ERROR",
    });
  }
}; 