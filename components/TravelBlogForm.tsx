"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTravelBlog } from "@/lib/actions";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";

const TravelBlogForm = () => {
  const [post, setPost] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(createTravelBlog, {
    error: "",
    status: "INITIAL",
  });

  // Handle successful form submission
  useEffect(() => {
    if (state?.status === "SUCCESS" && state?._id) {
      setShowSuccess(true);
      
      // Show success message briefly before redirect
      setTimeout(() => {
        router.push(`/travelblog/${state._id}`);
      }, 1500);
    }
  }, [state, router]);

  const handleFormSubmit = async (formData: FormData) => {
    formData.set("post", post);
    await formAction(formData);
  };

  // Get field-specific errors
  const getFieldError = (fieldName: string) => {
    return state?.issues?.[fieldName] || "";
  };

  if (showSuccess) {
    return (
      <section className="section_container">
        <div className="startup-form">
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-30-bold text-green-600">Success!</h2>
            <p className="text-16-medium">Your travel blog has been created successfully!</p>
            <p className="text-14-normal">Redirecting you to your post...</p>
          </div>
        </div>
      </section>
    );
  }

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

          {getFieldError("title") && (
            <p className="startup-form_error">{getFieldError("title")}</p>
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

          {getFieldError("description") && (
            <p className="startup-form_error">{getFieldError("description")}</p>
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

          {getFieldError("category") && (
            <p className="startup-form_error">{getFieldError("category")}</p>
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

          {getFieldError("image") && (
            <p className="startup-form_error">{getFieldError("image")}</p>
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

          {getFieldError("post") && (
            <p className="startup-form_error">{getFieldError("post")}</p>
          )}
        </div>

        <button
          type="submit"
          className="startup-form_btn text-white"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Travel Blog"}
        </button>

        {state?.error && state?.status === "ERROR" && (
          <p className="startup-form_error text-center">{state.error}</p>
        )}
      </form>
    </section>
  );
};

export default TravelBlogForm; 