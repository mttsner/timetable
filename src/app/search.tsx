"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
];

enum Groups {
    Subject,
    Program,
}

export default function Search({programs, subjects, onSubmit}) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {"Lisa õppekava/aine..."}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Otsi õppekava/aine..."/>
                    <CommandList>
                        <CommandEmpty>Pole õppekava/aine</CommandEmpty>
                        <CommandGroup heading="Programs">
                            {programs.map((program) => (
                                <CommandItem
                                    id={program}
                                    key={program}
                                    value={program}
                                    onSelect={(value) => {
                                        onSubmit(Groups.Program, value)
                                        setOpen(false)
                                    }}
                                >
                                    {program}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandGroup heading="Subjects">
                            {subjects.map((subject) => (
                                <CommandItem
                                    id={subject}
                                    key={subject}
                                    value={subject}
                                    onSelect={(value) => {
                                        onSubmit(Groups.Subject, value)
                                        setOpen(false)
                                    }}
                                >
                                    {subject}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
