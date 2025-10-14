"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

async function uploadImage(file: File) {
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("images").upload(filePath, file);

    if (error) throw error;

    const { data, error: signedError } = await supabase.storage
        .from("images")
        .createSignedUrl(filePath, 60 * 60); // URL valable 1h

    if (signedError) throw signedError;

    return data.signedUrl;
}
export default function Test() {
    const [image, setImage] = useState<string | null>(null);

    const handlePaste = async (e: React.ClipboardEvent) => {
        const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
        if (!item) return;
        const file = item.getAsFile();
        if (file) {
            const url = await uploadImage(file);
            setImage(url);
        }
    };

    return (
        <div
            onPaste={handlePaste}
            tabIndex={0}
            className="w-64 h-64 border-2 border-dashed flex items-center justify-center cursor-pointer"
        >
            {image ? <img src={image} className="max-w-full max-h-full" /> : "Colle une image ici"}
        </div>
    );
}
