import { supabase } from "./supabase";

export interface Club {
    id: string;
    name: string;
    description: string;
    faculty: string;
    student: string;
    icon: string;
    color: string;
}

export interface Event {
    id: string;
    club: string;
    title: string;
    description: string;
    date: string;
    image: string;
    tags: string[];
    isLive?: boolean;
}

export interface GalleryItem {
    id: string;
    club: string;
    title: string;
    image: string;
}

export interface Coordinator {
    id: string;
    name: string;
    type: 'faculty' | 'student';
    roll_number?: string;
    mobile: string;
    image: string;
    club: string;
}

export const getClubs = async (): Promise<Club[]> => {
    const { data, error } = await supabase
        .from('clubs')
        .select('*');

    if (error) {
        console.error("Error fetching clubs:", error);
        return [];
    }
    return data as Club[];
};

export const getEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error("Error fetching events:", error);
        return [];
    }
    return data as Event[];
};

export const getGallery = async (): Promise<GalleryItem[]> => {
    const { data, error } = await supabase
        .from('gallery')
        .select('*');

    if (error) {
        console.error("Error fetching gallery:", error);
        return [];
    }
    return data as GalleryItem[];
};

export const getCoordinators = async (): Promise<Coordinator[]> => {
    const { data, error } = await supabase
        .from('coordinators')
        .select('*')
        .order('type', { ascending: true });

    if (error) {
        console.error("Error fetching coordinators:", error);
        return [];
    }
    return data as Coordinator[];
};

export interface RegistrationData {
    name: string;
    email: string;
    roll_number: string;
    club: string;
    mobile: string;
    year: string;
}

export const submitRegistration = async (registrationData: RegistrationData) => {
    try {
        const { data, error } = await supabase
            .from('registrations')
            .insert([
                { ...registrationData, status: 'pending' }
            ])
            .select();

        if (error) throw error;
        return { success: true, id: data[0].id };
    } catch (error) {
        console.error("Error adding document: ", error);
        return { success: false, error };
    }
};
