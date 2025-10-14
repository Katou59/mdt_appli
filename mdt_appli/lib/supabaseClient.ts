import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImage(file: File) {
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("images").upload(filePath, file);

    if (error) throw error;

    const { data, error: signedError } = await supabase.storage
        .from("images")
        .createSignedUrl(filePath, 60 * 60); // URL valable 1h

    if (signedError) throw signedError;

    return data.signedUrl;
}