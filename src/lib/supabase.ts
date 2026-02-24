import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Proxy Supabase traffic through Next.js rewrite to avoid ISP blocking on client devices
const getSupabaseUrl = () => {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/supabase-proxy`;
    }
    return supabaseUrl;
};

export const supabase = createClient(getSupabaseUrl(), supabaseAnonKey);
