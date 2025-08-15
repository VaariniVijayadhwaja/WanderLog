import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { TRAVELBLOG_BY_ID_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it";
import { Suspense } from "react";
import View from "@/components/view";

const md = markdownit();

export const experimental_ppr = true;

interface TravelBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function TravelBlogPage({ params }: TravelBlogPageProps) {
  const { id } = await params;

  const post = await client.fetch(TRAVELBLOG_BY_ID_QUERY, { id });

  if (!post) return notFound();

  const parsedContent = md.render(post?.post || "");

  return (
    <>
      <section className="green_container">
        <p className="tag">{formatDate(post?._createdAt)}</p>

        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <img
          src={post.image || ""}
          alt={post.title || "Travel blog image"}
          className="w-full h-auto rounded-[10px] object-cover"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            {post.author?._id ? (
              <Link
                href={`/user/${post.author._id}`}
                className="flex gap-2 items-center mb-3"
              >
                <Image
                  src={post.author?.image || "/default-avatar.svg"}
                  alt={post.author?.name || "Author"}
                  width={64}
                  height={64}
                  className="rounded-full drop-shadow-lg"
                />
                <div>
                  <p className="text-20-medium">{post.author?.name}</p>
                  <p className="text-16-medium !text-black-300">
                    @{post.author?.username}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex gap-2 items-center mb-3">
                <Image
                  src={post.author?.image || "/default-avatar.svg"}
                  alt={post.author?.name || "Author"}
                  width={64}
                  height={64}
                  className="rounded-full drop-shadow-lg"
                />
                <div>
                  <p className="text-20-medium">{post.author?.name}</p>
                  <p className="text-16-medium !text-black-300">
                    @{post.author?.username}
                  </p>
                </div>
              </div>
            )}

            <p className="category-tag">{post.category}</p>
          </div>

          <h3 className="text-30-bold">Travel Story</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        <Suspense fallback={<div className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
}