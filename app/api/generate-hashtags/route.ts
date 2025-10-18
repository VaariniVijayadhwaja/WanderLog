import { NextRequest, NextResponse } from "next/server";
import { generateHashtags } from "@/lib/llm";
import { auth } from "@/auth";

/**
 * POST /api/generate-hashtags
 * Generates hashtags for a travel blog post using AI
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, content } = body;

    // Validate input
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Generate hashtags using Groq
    const hashtags = await generateHashtags({
      title: title.trim(),
      content: content.trim(),
    });

    // Return success response
    return NextResponse.json({
      success: true,
      hashtags,
    });
  } catch (error) {
    console.error("Error in generate-hashtags API:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate hashtags. Please try again.",
      },
      { status: 500 }
    );
  }
}

