import Image from "next/image";
import SearchForm from "@/components/SearchForm";
import TravelCard, { TravelTypeCard } from "@/components/TravelCard";
import { TRAVELBLOGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const { data: posts } = await sanityFetch({
    query: TRAVELBLOGS_QUERY,
    params,
  });

  let session = await auth()
  console.log("Session user:", session?.user?.id);

  return (
    <>
      <section className="green_container">
        <div className="flex justify-between">
          <h1 className="heading !py-12">
            SHARE YOUR TRAVEL STORIES WITH THE WORLD!!
          </h1>
          <Image
            src="/travel.png"
            alt="travel_icon"
            width={170}
            height={170}
            className="rounded-full"
          />
        </div>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold !text-white-100">
          {query
            ? `Search results for "${query}"`
            : "All Travel Stories"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: TravelTypeCard) => (
              <TravelCard key={post._id} post={post} />
            ))
          ) : (
            <p className="no-results">No travel stories found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
