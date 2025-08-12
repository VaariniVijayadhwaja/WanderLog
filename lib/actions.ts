"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";
import { travelBlogSchema } from "@/lib/validations";
import slugify from "slugify";

export const createTravelBlog = async (state: any, form: FormData) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const { title, description, category, image, post } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "post")
  );

  const postContent = form.get("post") as string;

  try {
    const travelBlog = {
      title,
      description,
      category,
      image,
      post: postContent,
    };

    await travelBlogSchema.parseAsync(travelBlog);

    const result = await writeClient.create({
      _type: "travelblogs",
      title,
      slug: {
        _type: "slug",
        current: slugify(title as string, { lower: true, strict: true }),
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      description,
      category,
      image,
      post: postContent,
      views: 0,
    });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
}; 