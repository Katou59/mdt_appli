"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Test() {
    function onClick() {
        toast.success("Utilisateur créé avec succés", {
            className: "bg-red-500",
        });
    }

    return <Button className="bg-success" onClick={onClick}>Test</Button>;
}
