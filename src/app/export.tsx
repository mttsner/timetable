import React from 'react';
import { Button } from "@/components/ui/button";
import { downloadICal } from "../taltech_api/ical_exporter";
import { useTimetableStore } from "./page";
import "./globals.css";
import { Download } from 'lucide-react';

export default function Export() {
    return (
        <Button
            className="absolute bottom-2 left-2 bg-white border border-black rounded border-opacity-50 shadow-md"
            size="icon"
            onClick={() => downloadICal(useTimetableStore)}>
            <Download className="w-8 h-8 stroke-black" />
        </Button>
    );
}