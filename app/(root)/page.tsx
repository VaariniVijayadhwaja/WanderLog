import Image from "next/image";
import SearchForm from "@/app/components/SearchForm"

export default function Home() {
  return (
    <>
    <section className="green_container">
      <div className="flex justify-between">
      <h1 className="heading !py-12">SHARE YOUR TRAVEL STORIES WITH THE WORLD!!</h1> 
      <Image src="/travel.png" alt="travel_icon" width={170} height={2} className="rounded-full"></Image>
      </div> 

      <SearchForm />
    </section>
    


    </>
  );
}
