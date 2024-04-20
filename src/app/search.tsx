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
import { useEffect, useState } from "react";
import { getDepartments } from "@/taltech_api/get_departments";
import { getCourses } from "@/taltech_api/get_courses";
import { useTimetableStore } from "./page";
import { search, searchSubject } from "@/lib/search";

export default function Search() {
    // Global timetable state
    const timetableId = useTimetableStore((state) => state.currentTimetableId);
    const addSubject = useTimetableStore((state) => state.addSubject);
    // Local search component state
    const [programs, setPrograms] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [open, setOpen] = useState(false);
    // Update programs and subjects when timetable id changes
    useEffect(() => {
        (async () => {
            // Get courses
            const courses = await getCourses(timetableId);
            setCourses(courses);
            // Extract subject codes from courses
            setSubjects(courses.map((course: any) => course.code));
            // Get deparments
            const departments = await getDepartments(timetableId);
            setDepartments(departments);
            // Extrat program codes from departments
            setPrograms(
                departments.flatMap((department: any) =>
                    department.curriculums.flatMap((curriculum: any) =>
                        curriculum.studentGroups.map(
                            (studentGroup: any) => studentGroup.code
                        )
                    )
                )
            );
        })();
    }, [timetableId]);
    // Add subjects from a program to the current schedule
    const onProgramSelect = async (code: string) => {
        const subject = await search(timetableId, departments, code);
        addSubject(subject);
    };
    // Add subject to the current schedule
    const onSubjectSelect = async (code: string) => {
        const subject = await searchSubject(timetableId, courses, code);
        addSubject(subject);
    };

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
                    <CommandInput placeholder="Otsi õppekava/aine..." />
                    <CommandList>
                        <CommandEmpty>Pole õppekava/aine</CommandEmpty>
                        <CommandGroup heading="Programs">
                            {programs.map((program) => (
                                <CommandItem
                                    id={program}
                                    key={program}
                                    value={program}
                                    onSelect={(value) => {
                                        onProgramSelect(value);
                                        setOpen(false);
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
                                        onSubjectSelect(value);
                                        setOpen(false);
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
