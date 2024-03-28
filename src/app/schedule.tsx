"use client"

// import { iacb } from "@/app/data";
import { HTMLAttributes, useEffect, useState } from "react";
import { search, searchSubject } from '@/lib/search';
import { listPrograms, listSubjects, listSelected } from '@/lib/list';
import { getDepartments } from "@/taltech_api/get_departments";
import { getTimetables } from "@/taltech_api/get_timetables";
import { getCourses } from "@/taltech_api/get_courses";
import { combineSchedules, removeStudentGroup, removeSubject } from "@/taltech_api/timetable_editor";
import "@/app/page.css";

function Card({ style, children, onClick, onMouseOver }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            style={style}
            className="rounded-xl bg-red-400 grid text-ellipsis overflow-hidden text-nowrap p-1 m-0.5"
            onClick={onClick}
            onMouseOver={onMouseOver}
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
    const [ currentGroup, setCurrentGroup ] = useState("");
    const [ selectedSubject , setSelectedSubject ] = useState("");
    const [ schedule, setSchedule ] = useState({ weekDays: [ { dow: 0, rows: [ { startTime: "", endTime: "", subjectName: "", weekCodes: [] } ] } ] } );
    const [ subjects, setSubjects ] = useState([]);
    const [ selectedId, setSelectedId ] = useState(0);
    const [ list, setList ] = useState([]);
    const weekDays = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday",
    };
    const [ currentDow, setCurrentDow ] = useState(1);

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
            let found = false;
            if (schedule.weekDays.length > 0) {
                schedule.weekDays.forEach((day) => {
                    if (day.dow === currentDow) {
                        setCurrentDow(day.dow);
                        found = true;
                        return;
                    }
                });
            }
            if (!found) {
                setCurrentDow(schedule.weekDays[0].dow);
            }
            setList(await listSelected(schedule));
        })()
    }, [schedule]);

    // Function for adding a layer on the schedule
    async function onAdd(type) {
        if (type) {
            if (currentGroup === "") {
                setSchedule(await search(timetableId, departments, selectedStudentGroup));
                setCurrentGroup(selectedStudentGroup);
            }
            else {
                setSchedule(combineSchedules(await search(timetableId, departments, selectedStudentGroup), removeStudentGroup(schedule, currentGroup)));
                setCurrentGroup(selectedStudentGroup);
                // setSchedule(combineSchedules(schedule, await search(timetableId, departments, selectedStudentGroup)));
            }
        }
        else {
            const subject = await searchSubject(timetableId, subjects, selectedSubject);
            const newSchedule = combineSchedules(schedule, subject);
            setSchedule(newSchedule);
        }
    }

    async function onRemove() {
        console.log(selectedSubject);
        setSchedule(removeSubject(schedule, selectedSubject));
    }

    return (
        <>
            <title>TalTech Scheduler</title>
            <div id="searchBar">
                <div class="search-dropdown">
                    <input 
                        id="search" 
                        list="Programmes" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        type="text" 
                        placeholder="Enter a subject/program"
                        autoComplete="off">
                    </input>
                    <select id="select" onClick={(e) => { 
                    if (e.target.id.startsWith("P_")) {
                        setSelectedStudentGroup(e.target.value);
                        setSelectedId(1);
                    }
                    else {
                        setSelectedSubject(e.target.value);
                        setSelectedId(0);
                    }
                    }}>
                        <optgroup label="Study Plans">
                            { resultProgram.map((program) => (
                                <option 
                                    id={"P_" + program} 
                                    key={program} 
                                    value={program}
                                >
                                    {program}
                                </option>
                            )) }
                        </optgroup>
                        <optgroup label="Single Subjects">
                            { resultSubject.map((subject) => (
                                <option 
                                    id={"S_" + subject} 
                                    key={subject} 
                                    value={subject}
                                >
                                    {subject}
                                </option>
                            )) }
                        </optgroup>
                    </select>
                </div>
                <button 
                    id="add" 
                    onClick={() => onAdd(selectedId)}
                >
                    🔎
                </button>
                <button 
                    id="export" 
                    onClick={() => console.log(schedule)}
                >
                    Export
                </button>
            </div>
            <div id="removeBar">
                <select 
                    id="subjects" 
                    onClick={(e) => {setSelectedSubject(e.target.value)}}
                >
                    <optgroup label="Subjects">
                        { list.map((subject) => (
                            <option 
                                key={subject} 
                                value={subject}
                            >
                                {subject}
                            </option>
                        ))}
                    </optgroup>
                </select>
                <button 
                    id="remove" 
                    onClick={() => onRemove()}
                >
                    ❌
                </button>
                <button 
                    id="left" 
                    onClick={() => {
                        if (currentDow === schedule.weekDays[0].dow) {
                            setCurrentDow(schedule.weekDays[schedule.weekDays.length - 1].dow);
                        }
                        else {
                            schedule.weekDays.forEach((day) => {
                                if (day.dow === currentDow) {
                                    setCurrentDow(schedule.weekDays[schedule.weekDays.indexOf(day) - 1].dow);
                                }
                            });
                        }
                }}>
                    &lt;
                </button>
                <button 
                    id="right" 
                    onClick={() => {
                        if (currentDow === schedule.weekDays[schedule.weekDays.length - 1].dow) {
                            setCurrentDow(schedule.weekDays[0].dow);
                        }
                        else {
                            schedule.weekDays.forEach((day) => {
                                if (day.dow === currentDow) {
                                    setCurrentDow(schedule.weekDays[schedule.weekDays.indexOf(day) + 1].dow);
                                }
                            });
                        }
                }}>
                    &gt;
                </button>
            </div>
            {schedule.weekDays.map((day) => {
                if (day.dow !== currentDow) {
                    return null;
                }
                else {
                    return (
                        <div className="overflow-x-auto">
                            <div className="grid border-gray-600 w-full grid-flow-row grid-cols-[repeat(17,1fr)] grid-rows-[repeat(58,1fr)]">
                                <div className="" key={0}>
                                    <p id="weekDay" className="border-r border-b">{weekDays[currentDow]}</p>
                                </div>
                                {[...Array(16)].map((x, i) => (
                                    <div id="week" className="border-r border-b" key={i + 1}>
                                        Week {i + 1}
                                    </div>
                                ))}
                                {generateTimeStrings().map((timeString, index) => (
                                    <div
                                        className="text-center border-r"
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
                                            <Card id="cards" onClick={() => {
                                                onRemove();
                                                }}
                                                onMouseOver={() => {setSelectedSubject(row.subjectCode);}}
                                                className="" style={{
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
                }})}
        </>
    );
}
