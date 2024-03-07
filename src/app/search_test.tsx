"use client"

import { useEffect, useState } from "react";

import { search } from '@/lib/search';
import { listPrograms } from '@/lib/list_programs';
import { getDepartments } from "@/taltech_api/get_departments";
import { getTimetables } from "@/taltech_api/get_timetables";



export default function SearchTest(props) {
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ result, setResult ] = useState([]);
    const [ timetableId, setTimetableId ] = useState(0);
    const [ departments, setDepartments ] = useState([]);
    const [ selectedStudentGroup, setSelectedStudentGroup ] = useState("");
    const [ program, setProgram ] = useState("");

    useEffect(() => {
        (async () => {
            const timetableId = (await getTimetables())[0]["currentId"];
            setTimetableId(timetableId);
            const department = await getDepartments(timetableId);
            setDepartments(department);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            console.log("Searching for:", searchQuery);
            setResult(await listPrograms(departments, searchQuery));
            // setResult(await search(timetableId, departments, searchQuery));
        })();
    }, [ searchQuery, departments ]);

    async function onSubmit() {
        setProgram(await search(timetableId, departments, selectedStudentGroup));
    }

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 16, padding: 16 }}>
                <form>
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Enter your program code"></input>
                </form>
            
                <div>
                    <select value={selectedStudentGroup} onChange={(e) => setSelectedStudentGroup(e.target.value)}>
                        { result.map((program) => (
                            <option key={program} value={program}>{program}</option>
                        )) }
                    </select>                
                </div>

                <button onClick={onSubmit}>Submit</button>
            </div>

            <p>{program}</p>
        </div>
    );
}