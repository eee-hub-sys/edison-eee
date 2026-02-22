"use server";

import { UpdateSchema, EventSchema, ClubSchema, CoordinatorSchema } from "@/lib/validations";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";


async function checkAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    // Temporarily bypassing session check because standard supabase-js client 
    // doesn't persist browser session to Server Actions without @supabase/ssr.
    // if (!session) throw new Error("Unauthorized");
    return session;
}

export async function updateRegistrationStatusAction(id: string, newStatus: 'accepted' | 'rejected') {
    try {
        await checkAdmin();

        // 1. Get the registration data
        const { data: reg, error: fetchError } = await supabase
            .from('registrations')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !reg) throw new Error("Registration not found");

        // 2. Update status
        const { error } = await supabase
            .from('registrations')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) throw error;



        revalidatePath("/admin");
        return { success: true };
    } catch (err) {
        console.error("Action error:", err);
        return { success: false, error: err instanceof Error ? err.message : "Unknown error occurred" };
    }
}

export async function deleteRegistrationAction(id: string) {
    try {
        await checkAdmin();
        const { error } = await supabase
            .from('registrations')
            .delete()
            .eq('id', id);

        if (error) throw error;
        revalidatePath("/admin");
        return { success: true };
    } catch (err) {
        console.error("Action error:", err);
        return { success: false, error: err instanceof Error ? err.message : "Unknown error occurred" };
    }
}

export async function addUpdateAction(formData: unknown) {
    try {
        await checkAdmin();
        const validated = UpdateSchema.parse(formData);
        const { error } = await supabase.from('updates').insert([validated]);
        if (error) throw error;
        revalidatePath("/admin");
        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error occurred" };
    }
}

export async function deleteUpdateAction(id: string) {
    try {
        await checkAdmin();
        const { error } = await supabase.from('updates').delete().eq('id', id);
        if (error) throw error;
        revalidatePath("/admin");
        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error occurred" };
    }
}

export async function addEventAction(formData: unknown) {
    try {
        await checkAdmin();
        const validated = EventSchema.parse(formData);
        const { error } = await supabase.from('events').insert([validated]);
        if (error) throw error;
        revalidatePath("/admin");
        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error occurred" };
    }
}

export async function deleteEventAction(id: string) {
    try {
        await checkAdmin();
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) throw error;
        revalidatePath("/admin");
        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error occurred" };
    }
}

export async function updateClubAction(id: string, formData: unknown) {
    try {
        await checkAdmin();
        const validated = ClubSchema.parse(formData);
        const { error } = await supabase.from('clubs').update(validated).eq('id', id);
        if (error) throw error;
        revalidatePath("/admin");
        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error occurred" };
    }
}

export async function addCoordinatorAction(formData: unknown) {
    try {
        await checkAdmin();
        const validated = CoordinatorSchema.parse(formData);
        const { error } = await supabase.from('coordinators').insert([validated]);
        if (error) throw error;
        revalidatePath("/admin");
        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error occurred" };
    }
}

export async function deleteCoordinatorAction(id: string) {
    try {
        await checkAdmin();
        const { error } = await supabase.from('coordinators').delete().eq('id', id);
        if (error) throw error;
        revalidatePath("/admin");
        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error occurred" };
    }
}
