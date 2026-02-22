import { supabase } from "./supabase";

export const seedInitialData = async () => {
    const { data: existingClubs, error: fetchError } = await supabase
        .from('clubs')
        .select('id')
        .limit(1);

    if (fetchError) {
        console.error("Error checking existing clubs:", fetchError);
        return;
    }

    if (!existingClubs || existingClubs.length === 0) {
        console.log("Seeding Database...");
        const initialClubs = [
            { name: "Green Energy", description: "Social Awareness on Energy Conservation & Green Energy.", faculty: "Dr. G. Srinivas", student: "23891A0221, 23891A0219, 23891A0208", icon: "🌱", color: "#30D158" },
            { name: "Echo", description: "The Communication Skills Club dedicated to enhancing professional expression.", faculty: "Mrs. G. Sravanthi", student: "23891A0226, 23891A0204", icon: "📣", color: "#818cf8" },
            { name: "Vidyut", description: "The EEE Hobby Club for creative exploration and hands-on projects.", faculty: "Mr. Ganji Srikanth", student: "24895A0208, 24895A0219", icon: "🎨", color: "#facc15" },
            { name: "Krida", description: "The official Sport Club of the EEE Department.", faculty: "Mr. M. Ramesh Kumar", student: "24895A0221", icon: "🏅", color: "#ff375f" },
            { name: "Tech Forge Club", description: "The Career Club focused on professional growth and industry readiness.", faculty: "Mr. K. Vishnu", student: "23891A0242, 23891A0218", icon: "🏗️", color: "#38bdf8" }
        ];

        const initialEvents = [
            { club: "Green Energy", title: "Energy Conservation Seminar", description: "Learn about sustainable power and conservation strategies.", date: "2024-03-10", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800", tags: ["Green", "Awareness"] },
            { club: "Echo", title: "Speech & Debate Meet", description: "Enhance your public speaking skills with current industry topics.", date: "2024-03-15", image: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&q=80&w=800", tags: ["Soft Skills", "Debate"] },
            { club: "Vidyut", title: "Creative Tech Workshop", description: "Hands-on session on creative electronics and hobby projects.", date: "2024-03-20", image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=800", tags: ["Hobby", "Tech"] },
            { club: "Krida", title: "EEE Annual Sports Meet", description: "Departmental sports competitions and athletic events.", date: "2024-04-01", image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800", tags: ["Sports", "Tournament"] },
            { club: "Tech Forge Club", title: "Career Growth Bootcamp", description: "Intensive training for placements and professional excellence.", date: "2024-03-25", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800", tags: ["Career", "Bootcamp"] }
        ];

        const initialGallery = [
            { club: "Green Energy", title: "Solar Power Campaign", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800" },
            { club: "Echo", title: "Communication Workshop", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" },
            { club: "Vidyut", title: "Hobby Project Showcase", image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=800" },
            { club: "Krida", title: "Football Tournament", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800" },
            { club: "Tech Forge Club", title: "Industry Interaction Session", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800" }
        ];

        const initialUpdates = [
            { message: "⚡ Welcome to the official EDISON EEE Portal! Stay tuned for more updates." },
            { message: "🚀 New Robotics Workshop announced for March 10th – Register now!" },
            { message: "✨ Guest Lecture on Smart Grids happening this Friday at Seminar Hall." },
            { message: "📣 EDISON Annual Cultural Meet dates released – Check the events section." }
        ];

        await supabase.from('clubs').insert(initialClubs);
        await supabase.from('events').insert(initialEvents);
        await supabase.from('gallery').insert(initialGallery);
        await supabase.from('updates').insert(initialUpdates);

        console.log("Seeding Complete!");
    }
};
