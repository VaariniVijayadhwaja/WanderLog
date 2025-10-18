/**
 * LLM utility for Groq API integration
 * Handles hashtag generation using Groq's fast inference
 */

interface HashtagGenerationParams {
  title: string;
  content: string;
}

interface GroqChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqChatRequest {
  model: string;
  messages: GroqChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

/**
 * Generate hashtags using Groq API
 * @param params - Title and content of the travel blog
 * @returns Array of hashtag strings (without # symbol)
 */
export async function generateHashtags({
  title,
  content,
}: HashtagGenerationParams): Promise<string[]> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }

  // Prepare the prompt for hashtag generation
  const systemPrompt = `You are a travel content expert. Generate relevant, engaging hashtags for travel blog posts. 
Rules:
- Generate 6-8 hashtags
- Make them relevant to travel, location, activity, and experience
- Use lowercase only
- Be specific and descriptive
- Mix popular and niche hashtags
- Return ONLY the hashtags as a comma-separated list
- Do NOT include the # symbol
- Example output: adventure, hiking, mountains, nepal, everest, trekking, himalayas, bucketlist`;

  const userPrompt = `Generate hashtags for this travel blog:

Title: ${title}

Content: ${content.substring(0, 1000)}

Return only comma-separated hashtags without # symbol.`;

  const requestBody: GroqChatRequest = {
    model: "llama-3.1-8b-instant", // Fast and efficient model
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature: 0.7, // Balanced creativity
    max_tokens: 100, // Enough for hashtags
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      throw new Error(`Groq API request failed: ${response.status}`);
    }

    const data = await response.json();
    const hashtagText = data.choices[0]?.message?.content || "";

    // Parse hashtags from response
    const hashtags = hashtagText
      .split(",")
      .map((tag: string) => tag.trim().replace(/^#/, "").toLowerCase()) // Remove # symbol
      .filter((tag: string) => tag.length > 0 && tag.length <= 30) // Filter out hashtags longer than 30 characters
      .slice(0, 8); // Limit to 8 hashtags

    return hashtags;
  } catch (error) {
    console.error("Error generating hashtags:", error);
    throw error;
  }
}

