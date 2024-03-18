"use client"

// import { iacb } from "@/app/data";
import { HTMLAttributes, useEffect, useState } from "react";
import { search, searchSubject } from '@/lib/search';
import { listPrograms, listSubjects, listSelected } from '@/lib/list';
import { getDepartments } from "@/taltech_api/get_departments";
import { getTimetables } from "@/taltech_api/get_timetables";
import { getCourses } from "@/taltech_api/get_courses";
import { combineLayers, removeLayer } from "@/taltech_api/timetable_editor";

function Card({ style, children }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            style={style}
            className="bg-red-400 grid text-ellipsis overflow-hidden text-nowrap p-1 m-0.5"
        >
            {children}
        </div>
    );
}

export default function Schedule() {
    const timeToIndex = (time: string) => {
        let times = time.split(":");
        // Convert time to grid index
        // The grid is made up of 15 minute cells
        // The first cell is 08:00 and the last cell is 22:00
        let hour = (+times[0] - 8) * 4;
        let minute = +times[1] / 15;

        return hour + minute + 1; // Css grid index starts at 1
    };

    const createCards = (weekCodes: string[]) => {
        // Extract numbers from week codes and sort in ascending order
        const codes = weekCodes
            .map((code) => Number(code.slice(6)))
            .sort((a, b) => a - b);
        // Find all sequential week codes and create ranges
        const ranges = codes.reduce((acc: number[][], num, index) => {
            if (index === 0) {
                acc.push([num]);
            }
            if (index !== 0 && codes[index - 1] !== num - 1) {
                acc.push([num]);
            }
            if (codes[index + 1] !== num + 1) {
                acc[acc.length - 1].push(num);
            }
            return acc;
        }, []);

        return ranges;
    };

    const generateTimeStrings = () => {
        const startHour = 8;
        const endHour = 22;
        const hours = Array.from(
            { length: endHour - startHour + 1 },
            (_, i) => startHour + i
        );
        const minutes = Array.from({ length: 4 }, (_, i) => i * 15);

        return hours
            .flatMap((hour) =>
                minutes.map((minute) => {
                    if (hour === endHour && minute !== 0) {
                        return null; // Ignore times beyond 22:00
                    }
                    return `${String(hour).padStart(2, "0")}:${String(
                        minute
                    ).padStart(2, "0")}`;
                })
            )
            .filter((timeString) => timeString !== null); // Filter out null values
    };

    const [ searchQuery, setSearchQuery ] = useState("");
    const [ resultProgram, setResultProgram ] = useState([]);
    const [ resultSubject, setResultSubject ] = useState([]);
    const [ timetableId, setTimetableId ] = useState(0);
    const [ departments, setDepartments ] = useState([]);
    const [ selectedStudentGroup, setSelectedStudentGroup ] = useState("");
    const [ selectedSubject , setSelectedSubject ] = useState("");
    const [ schedule, setSchedule ] = useState({ weekDays: [ { dow: "", rows: [ { startTime: "", endTime: "", subjectName: "", weekCodes: [] } ] } ] } );
    const [ subjects, setSubjects ] = useState([]);
    const [ selectedId, setSelectedId ] = useState(0);
    const [ list, setList] = useState([]);

    // Upon opening the site, fetch the timetable id, departments and subjects
    useEffect(() => {
        (async () => {
            const timetableId = (await getTimetables())[0]["currentId"];
            setTimetableId(timetableId);
            const department = await getDepartments(timetableId);
            setDepartments(department);
            const subject = await getCourses(timetableId);
            setSubjects(subject);
        })();
    }, []);

    // Whenever the search query changes, update the list of programs and subjects
    useEffect(() => {
        (async () => {
            setResultProgram(await listPrograms(departments, searchQuery));
            setResultSubject(await listSubjects(subjects, searchQuery));
        })();
    }, [searchQuery, departments, subjects]);

    // Whenever the schedule changes, uptdate the list of selected subjects
    useEffect(() => {
        (async () => {
            setList(await listSelected(schedule));
        })()
    }, [schedule]);

    // Function for adding a layer on the schedule
    async function onAdd(type) {
        if (type) {
            setSchedule(await search(timetableId, departments, selectedStudentGroup));
        }
        else {
            const subject = await searchSubject(timetableId, subjects, selectedSubject);
            const newSchedule = await combineLayers(schedule, subject);
            setSchedule(newSchedule);
        }
    }

    async function onRemove() {
        setSchedule(await removeLayer(schedule, selectedSubject));
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 16, padding: 16 }}>
                <form>
                    <input list="Programmes" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Enter the code"></input>
                </form>
            
                <div>
                    <select onClick={(e) => { 
                    if (e.target.id.startsWith("P_")) {
                        setSelectedStudentGroup(e.target.value);
                        setSelectedId(1);
                    }
                    else {
                        setSelectedSubject(e.target.value);
                        setSelectedId(0);
                    }
                    }}>
                        <optgroup label="Programmes">
                            { resultProgram.map((program) => (
                                <option id={"P_" + program} key={program} value={program}>{program}</option>
                            )) }
                        </optgroup>
                        <optgroup label="Subjects">
                            { resultSubject.map((subject) => (
                                <option id={"S_" + subject} key={subject} value={subject}>{subject}</option>
                            )) }
                        </optgroup>
                    </select>
                </div>
                <button onClick={() => onAdd(selectedId)}>Add</button>
            </div>
            <div>
                <select>
                    <optgroup label="Subjects" onClick={(e) => {setSelectedSubject(e.target.value)}}>
                        { list.map((subject) => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </optgroup>
                </select>
            </div>
            <div>
                <button onClick={() => onRemove()}>Remove</button>
            </div>
            {schedule.weekDays.map((day) => {
                return (
                    <div className="overflow-x-auto">
                        {day.dow}
                        <div className="grid border-gray-600 w-full grid-flow-row grid-cols-[repeat(17,1fr)] grid-rows-[repeat(58,1fr)]">
                            <div className="" key={0}>
                                Times
                            </div>
                            {[...Array(16)].map((x, i) => (
                                <div className="w-20" key={i + 1}>
                                    Week {i + 1}
                                </div>
                            ))}
                            {generateTimeStrings().map((timeString, index) => (
                                <div
                                    className=""
                                    key={index}
                                    style={{
                                        gridRow: 2 + index,
                                    }}
                                >
                                    {timeString}
                                </div>
                            ))}
                            {day.rows.map((row) =>
                                createCards(row.weekCodes).map((code, key) => {
                                    return (
                                        <Card
                                            style={{
                                                gridRowStart: 1 + timeToIndex(row.startTime),
                                                gridRowEnd: 1 + timeToIndex(row.endTime),
                                                gridColumnStart: 1 + code[0],
                                                gridColumnEnd: 2 + code[1],
                                            }}
                                        >
                                            {key === 0 ? row.subjectName : ""}
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
