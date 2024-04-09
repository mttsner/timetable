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

export default function Overview({ list, submit }) {
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
                                <Button variant="ghost" size="icon" onClick={() => submit(code)}>
                                    <Trash2 className="w-5 h-5"/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
