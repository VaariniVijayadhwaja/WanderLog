"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTravelBlog } from "@/lib/actions";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";

const TravelBlogForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [post, setPost] = useState("");
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(createTravelBlog, {
    error: "",
    status: "INITIAL",
  });

  // Handle successful form submission
  useEffect(() => {
    if (state?.status === "SUCCESS" && state?._id) {
      router.push(`/travelblog/${state._id}`);
    }
  }, [state, router]);

  const handleFormSubmit = async (formData: FormData) => {
    formData.set("post", post);
    await formAction(formData);
  };

  return (
    <section className="section_container">
      <form action={handleFormSubmit} className="startup-form">
        <div>
          <label htmlFor="title" className="startup-form_label">
            Title
          </label>
          <input
            id="title"
            name="title"
            className="startup-form_input"
            required
            placeholder="Travel Blog Title"
          />

          {errors.title && (
            <p className="startup-form_error">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="startup-form_label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="startup-form_textarea"
            required
            placeholder="Brief description of your travel experience"
          />

          {errors.description && (
            <p className="startup-form_error">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="startup-form_label">
            Category
          </label>
          <input
            id="category"
            name="category"
            className="startup-form_input"
            required
            placeholder="e.g. Adventure, City, Beach, Culture"
          />

          {errors.category && (
            <p className="startup-form_error">{errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="startup-form_label">
            Image URL
          </label>
          <input
            id="image"
            name="image"
            className="startup-form_input"
            required
            placeholder="https://example.com/your-travel-image.jpg"
          />

          {errors.image && (
            <p className="startup-form_error">{errors.image}</p>
          )}
        </div>

        <div data-color-mode="light">
          <label htmlFor="post" className="startup-form_label">
            Travel Story
          </label>
          <div className="startup-form_editor">
            <MDEditor
              value={post}
              onChange={(value: string | undefined) => setPost(value || "")}
              id="post"
              preview="edit"
              height={300}
              textareaProps={{
                placeholder:
                  "Share your travel story... describe the places you visited, experiences you had, food you tried, people you met, and memories you made!",
                style: {
                  color: "#000",
                  fontSize: 16,
                  lineHeight: 1.4,
                  fontFamily: "inherit",
                },
              }}
              previewOptions={{
                disallowedElements: ["style"],
              }}
            />
          </div>

          {errors.post && (
            <p className="startup-form_error">{errors.post}</p>
          )}
        </div>

        <button
          type="submit"
          className="startup-form_btn text-white"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Travel Blog"}
        </button>

        {state?.error && (
          <p className="startup-form_error">{state.error}</p>
        )}
      </form>
    </section>
  );
};

export default TravelBlogForm; 