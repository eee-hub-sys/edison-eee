import Hero from "@/components/home/Hero";
import UpdatesStrip from "@/components/home/UpdatesStrip";
import About from "@/components/home/About";
import Clubs from "@/components/home/Clubs";
import Events from "@/components/home/Events";
import Gallery from "@/components/home/Gallery";

import Registration from "@/components/home/Registration";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <UpdatesStrip />
      <div className="max-w-7xl mx-auto px-6 space-y-20 md:space-y-32 py-12 md:py-20">
        <About />
        <Clubs />
        <Events />
        <Gallery />

        <Registration />
      </div>
    </main>
  );
}
