"use server";

import { RegistrationSchema } from "@/lib/validations";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/ratelimit";
import { headers } from "next/headers";


export async function submitRegistrationAction(formData: unknown) {
    // 1. Rate Limiting (IP-based)
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "anonymous";
    const { success } = await rateLimit(`reg_${ip}`, 3, "1 h"); // Limit to 3 registrations per hour per IP

    if (!success) {
        return { success: false, error: "Too many registration attempts. Please try again later." };
    }

    // 2. Strict Input Validation
    const validated = RegistrationSchema.safeParse(formData);

    if (!validated.success) {
        return {
            success: false,
            error: "Validation failed: " + validated.error.issues.map(i => i.message).join(", ")
        };
    }

    // 3. Sanitized Database Insert
    const { data, error } = await supabase
        .from('registrations')
        .insert([validated.data])
        .select();

    if (error) {
        console.error("DB Error:", error);
        return { success: false, error: "A database error occurred. Please try again." };
    }



    return { success: true, id: data[0].id };
}
