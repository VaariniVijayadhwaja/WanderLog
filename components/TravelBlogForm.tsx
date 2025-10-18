"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTravelBlog } from "@/lib/actions";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { Sparkles, RefreshCw } from "lucide-react";
import HashtagSelector from "@/components/HashtagSelector";

const TravelBlogForm = () => {
  const [post, setPost] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [hashtagError, setHashtagError] = useState("");
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
    formData.set("hashtags", JSON.stringify(selectedHashtags));
    await formAction(formData);
  };

  // Generate hashtags using LLM
  const handleGenerateHashtags = async () => {
    setHashtagError("");

    // Get title and content from form
    const form = document.querySelector("form") as HTMLFormElement;
    const titleInput = form?.querySelector("#title") as HTMLInputElement;
    const title = titleInput?.value || "";

    if (!title.trim()) {
      setHashtagError("Please enter a title first");
      return;
    }

    if (!post.trim()) {
      setHashtagError("Please write some content first");
      return;
    }

    setIsGeneratingHashtags(true);

    try {
      const response = await fetch("/api/generate-hashtags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: post,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate hashtags");
      }

      if (data.success && data.hashtags) {
        setSuggestedHashtags(data.hashtags);
        // Auto-select first 6 hashtags
        setSelectedHashtags(data.hashtags.slice(0, 6));
      }
    } catch (error) {
      console.error("Error generating hashtags:", error);
      setHashtagError(
        error instanceof Error ? error.message : "Failed to generate hashtags"
      );
    } finally {
      setIsGeneratingHashtags(false);
    }
  };

  // Toggle hashtag selection
  const handleToggleHashtag = (hashtag: string) => {
    setSelectedHashtags((prev) =>
      prev.includes(hashtag)
        ? prev.filter((h) => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  // Remove hashtag from suggestions
  const handleRemoveHashtag = (hashtag: string) => {
    setSuggestedHashtags((prev) => prev.filter((h) => h !== hashtag));
    setSelectedHashtags((prev) => prev.filter((h) => h !== hashtag));
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

        {/* Hashtag Generation Section */}
        <div className="space-y-3">
          <label className="startup-form_label">Hashtags (Optional)</label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGenerateHashtags}
              disabled={isGeneratingHashtags || isPending}
              className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGeneratingHashtags ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Hashtags</span>
                </>
              )}
            </button>

            {suggestedHashtags.length > 0 && (
              <button
                type="button"
                onClick={handleGenerateHashtags}
                disabled={isGeneratingHashtags || isPending}
                className="flex items-center gap-2 px-4 py-2 bg-black-200/10 text-black-200 rounded-md hover:bg-black-200/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate</span>
              </button>
            )}
          </div>

          {hashtagError && (
            <p className="startup-form_error">{hashtagError}</p>
          )}

          {suggestedHashtags.length > 0 && (
            <HashtagSelector
              hashtags={suggestedHashtags}
              selectedHashtags={selectedHashtags}
              onToggle={handleToggleHashtag}
              onRemove={handleRemoveHashtag}
            />
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