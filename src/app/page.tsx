import Hero from "@/components/home/Hero";
import UpdatesStrip from "@/components/home/UpdatesStrip";
import About from "@/components/home/About";
import Clubs from "@/components/home/Clubs";
import Events from "@/components/home/Events";
import Gallery from "@/components/home/Gallery";
import Registration from "@/components/home/Registration";
import { getClubs, getCoordinators, getEvents, getGallery } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const [clubs, coordinators, events, gallery, updatesRes] = await Promise.all([
    getClubs(),
    getCoordinators(),
    getEvents(),
    getGallery(),
    supabase.from('updates').select('message').order('created_at', { ascending: false }).limit(10)
  ]);

  const stats = {
    clubs: clubs.length,
    members: 500, // Static fallback or fetch if needed
    events: events.length
  };

  const initialUpdates = updatesRes.data?.map((u: { message: string }) => u.message) || [];

  return (
    <main className="min-h-screen">
      <Hero initialStats={stats} />
      <UpdatesStrip initialUpdates={initialUpdates} />
      <div className="max-w-7xl mx-auto px-6 space-y-20 md:space-y-32 py-12 md:py-20">
        <About />
        <Clubs initialClubs={clubs} initialCoordinators={coordinators} />
        <Events initialEvents={events} />
        <Gallery initialGallery={gallery} />
        <Registration />
      </div>
    </main>
  );
}
