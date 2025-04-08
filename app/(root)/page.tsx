import Image from "next/image";
import SearchForm from "@/components/SearchForm"
import TravelCard from "@/components/TravelCard"

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const query = (await searchParams).query

  const posts = [{
    _createdAt: new Date(),
    views: 55,
    author: { _id: 1 , name: 'Vaarini'},
    _id: 1,
    description: 'This is a description.',
    image: 'https://images.unsplash.com/photo-1453747063559-36695c8771bd?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Venice',
    title: 'Venice'
  }];
  
  return (
    <>
    <section className="green_container">
      <div className="flex justify-between">
      <h1 className="heading !py-12">SHARE YOUR TRAVEL STORIES WITH THE WORLD!!</h1> 
      <Image src="/travel.png" alt="travel_icon" width={170} height={2} className="rounded-full"></Image>
      </div> 

      <SearchForm query = {query}/>
    </section>
    
    <section className="section_container">
      <p className="text-30-semibold !text-white-100">
      {query? `Search for results ${query}`: 'All Travel stories'} </p>
      <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: TravelTypeCard) => (
              <TravelCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>

    </section>


    </>
  );
}
