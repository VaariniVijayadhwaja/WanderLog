import { formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Author, Travelblogs } from "@/sanity.types";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export type TravelTypeCard = Omit<Travelblogs, "author"> & { author?: Author };

const TravelCard = ({ post }: { post: TravelTypeCard }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
    hashtags,
  } = post;

  return (
    <li className="travel-card group">
      <div className="flex-between">
        <p className="travel-card_date !text-black-200">
          {formatDate(_createdAt)}
        </p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-black-200">{views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          {author?._id ? (
            <Link href={`/user/${author._id}`}>
              <p className="text-16-medium line-clamp-1">{author?.name}</p>
            </Link>
          ) : (
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          )}
          <Link href={`/travelblog/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        {author?._id ? (
          <Link href={`/user/${author._id}`}>
            <Image
              src={author?.image || "/default-avatar.svg"}
              alt={author?.name || "Author"}
              width={48}
              height={48}
              className="rounded-full"
            />
          </Link>
        ) : (
          <Image
            src={author?.image || "/default-avatar.svg"}
            alt={author?.name || "Author"}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
      </div>

      <Link href={`/travelblog/${_id}`}>
        <p className="travel-card_desc">{description}</p>
        <img src={image} alt={title} className="travel-card_img" />
      </Link>

      {/* Hashtags - show first 3 */}
      {hashtags && hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {hashtags.slice(0, 3).map((hashtag, index) => (
            <Link
              key={index}
              href={`/?query=${hashtag}`}
              className="text-12-medium text-primary-100 hover:text-primary/80 transition-colors"
            >
              #{hashtag}
            </Link>
          ))}
          {hashtags.length > 3 && (
            <span className="text-12-medium text-black-300">
              +{hashtags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/travelblog/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export const TravelCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index) => (
      <li key={`travel-skeleton-${index}`}>
        <Skeleton className="travel-card_skeleton" />
      </li>
    ))}
  </>
);

export default TravelCard;
