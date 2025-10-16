"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CircleX, Terminal } from "lucide-react";
import { createContext, useState, Dispatch, SetStateAction, useContext } from "react";

type AlertContextType = {
    alert: { title?: string; description?: string } | null;
    setAlert: Dispatch<SetStateAction<{ title?: string; description?: string } | null>>;
};

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alert, setAlert] = useState<{ title?: string; description?: string } | null>(null);

    return (
        <AlertContext.Provider value={{ alert, setAlert }}>
            {alert?.title || alert?.description ? (
                <Alert variant="destructive" className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CircleX className="h-8 w-8 shrink-0" />
                        <div>
                            <AlertTitle className="font-extrabold">{alert.title}</AlertTitle>
                            <AlertDescription className="text-destructive">{alert.description}</AlertDescription>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="hover:text-destructive"
                        onClick={() => setAlert(null)}
                    >
                        Ok
                    </Button>
                </Alert>
            ) : null}
            {children}
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) throw new Error("useAlert doit être utilisé dans un AlertProvider");
    return context;
}
