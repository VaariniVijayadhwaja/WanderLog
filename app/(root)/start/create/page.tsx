import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TravelBlogForm from "@/components/TravelBlogForm";

export default async function CreatePage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <section className="green_container">
        <h1 className="heading">
          Share Your Travel Story!
        </h1>
      </section>

      <TravelBlogForm />
    </>
  );
} 