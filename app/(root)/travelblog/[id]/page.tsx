import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  TRAVELBLOG_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/view";
import TravelCard, { TravelTypeCard } from "@/components/TravelCard";

const md = markdownit();

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  debugger;
  const [post] = await Promise.all([
    client.fetch(TRAVELBLOG_BY_ID_QUERY, { id }),
    // client.fetch(PLAYLIST_BY_SLUG_QUERY, {
    //   slug: "editor-picks-new",
    // }),
  ]);

  if (!post) return notFound();

  const parsedContent = md.render(post?.post || "");

  return (
    <>
      <section className="green_container !min-h-[210px]">
        <p className="tag !mb-2">{formatDate(post?._createdAt)}</p>

        <h1 className="heading !mb-1">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium !text-white-100">{post.author.name}</p>
                <p className="text-16-medium !text-white-100">
                  @{post.author.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{post.category}</p>
          </div>

          <h3 className="text-30-bold !text-white-100">Story Details</h3>
          {parsedContent ? (
            <article
              className="prose prose-h1:text-yellow-300 max-w-4xl font-dynapuff break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        {/* {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>

            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: TravelTypeCard, i: number) => (
                <TravelCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )} */}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;