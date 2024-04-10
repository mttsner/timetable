import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useTimetableStore } from "./page";
import { useEffect, useState } from "react";
import { listSelected } from "@/lib/list";

export default function Overview() {
    // Global timetable state
    const schedule = useTimetableStore(
        (state) => state.timetables[state.currentTimetableId]
    );
    const removeSubject = useTimetableStore((state) => state.removeSubject);
    // Local search component state
    const [list, setList] = useState<any[]>([]);
    // Whenever the schedule changes, uptdate the list of selected subjects
    useEffect(() => {
        (async () => {
            const selected = await listSelected(schedule);
            setList(selected);
        })();
    }, [schedule]);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ainekood</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.map((code) => (
                        <TableRow key={code}>
                            <TableCell>{code}</TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSubject(code)}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
