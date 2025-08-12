import Ping from "@/components/ping";
import { client } from "@/sanity/lib/client";
import { TRAVELBLOG_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
// import { unstable_after as after } from "next/server";

const View = async ({ id }: { id: string }) => {
  const data = await client
  .withConfig({ useCdn: false })
  .fetch(TRAVELBLOG_VIEWS_QUERY, { id });
    
  const totalViews = data?.views ?? 0;

  writeClient
    .patch(id)
    .set({ views: totalViews + 1 })
    .commit()
    .catch((err) => console.error("Failed to update views:", err));


  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
};
export default View;