import { notFound } from "next/navigation";
import Image from "next/image";
import { AUTHOR_BY_ID_QUERY, AUTHOR_TRAVEL_BLOGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import TravelCard, { TravelTypeCard } from "@/components/TravelCard";

interface UserProfileProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfile({ params }: UserProfileProps) {
  const { id } = await params;

  const { data: user } = await sanityFetch({
    query: AUTHOR_BY_ID_QUERY,
    params: { id },
  });

  if (!user) {
    return notFound();
  }

  const { data: userTravelBlogs } = await sanityFetch({
    query: AUTHOR_TRAVEL_BLOGS_QUERY,
    params: { id },
  });

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name || "User"}
            width={220}
            height={220}
            className="profile_image"
          />

          <p className="text-30-extrabold mt-7 text-center">
            @{user.username}
          </p>
          <p className="mt-1 text-center text-14-normal">
            {user.bio || "No bio available"}
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {user.name}'s Travel Stories
          </p>
          <ul className="card_grid-sm">
            {userTravelBlogs?.length > 0 ? (
              userTravelBlogs.map((post: TravelTypeCard) => (
                <TravelCard key={post._id} post={post} />
              ))
            ) : (
              <p className="no-results">No travel stories found</p>
            )}
          </ul>
        </div>
      </section>
    </>
  );
} 