import { formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Author, Travelblogs } from "@/sanity.types";
// import { Skeleton } from "@/components/ui/skeleton";
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
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/travel/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${author?._id}`}>
          <Image
            src={author?.image || "https://placehold.co/48x48"}
            alt={author?.name || "Author"}
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/travel/${_id}`}>
        <p className="travel-card_desc">{description}</p>
        <img src={image} alt={title} className="travel-card_img" />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/travel/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

// export const TravelCardSkeleton = () => (
//   <>
//     {[0, 1, 2, 3, 4].map((index) => (
//       <li key={`travel-skeleton-${index}`}>
//         <Skeleton className="travel-card_skeleton" />
//       </li>
//     ))}
//   </>
// );

export default TravelCard;
