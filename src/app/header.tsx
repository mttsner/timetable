"use client";
import { listPrograms, listSelected, listSubjects } from "@/lib/list";
import { search, searchSubject } from "@/lib/search";
import { getCourses } from "@/taltech_api/get_courses";
import { getDepartments } from "@/taltech_api/get_departments";
import { getTimetables } from "@/taltech_api/get_timetables";
import {
    combineSchedules,
    removeStudentGroup,
    removeSubject,
} from "@/taltech_api/timetable_editor";
import { useEffect, useState } from "react";
import Timetable from "./timetable";
import Search from "./search";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Overview from "./overview";
import Logo from "@/components/logo";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [resultProgram, setResultProgram] = useState([]);
    const [resultSubject, setResultSubject] = useState([]);
    const [timetableId, setTimetableId] = useState(0);
    const [departments, setDepartments] = useState([]);
    const [selectedStudentGroup, setSelectedStudentGroup] = useState("");
    const [currentGroup, setCurrentGroup] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [schedule, setSchedule] = useState({
        weekDays: [
            {
                dow: 0,
                rows: [
                    {
                        startTime: "",
                        endTime: "",
                        subjectName: "",
                        weekCodes: [],
                    },
                ],
            },
        ],
    });
    const [subjects, setSubjects] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    const [list, setList] = useState([]);

    const [currentDow, setCurrentDow] = useState(1);

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
        })();
    }, [schedule]);

    // Function for adding a layer on the schedule
<<<<<<< HEAD
    async function onAdd(type: number) {
    if (type) {
        if (currentGroup === "") {
                setSchedule(
                    await search(timetableId, departments, selectedStudentGroup)
                );
                setCurrentGroup(selectedStudentGroup);
=======
    async function onAdd(type: number, value: string) {
        if (type) {
            if (currentGroup === "") {
                setSchedule(await search(timetableId, departments, value));
                setCurrentGroup(value);
>>>>>>> 35541d1708f281db7821c24bc5cccd4d66e977d2
            } else {
                setSchedule(
                    combineSchedules(
                        await search(timetableId, departments, value),
                        removeStudentGroup(schedule, currentGroup)
                    )
                );
                setCurrentGroup(value);
                // setSchedule(combineSchedules(schedule, await search(timetableId, departments, selectedStudentGroup)));
            }
        } else {
            const subject = await searchSubject(timetableId, subjects, value);
            const newSchedule = combineSchedules(schedule, subject);
            setSchedule(newSchedule);
        }
    }

    async function onRemove(code: String) {
        setSchedule(removeSubject(schedule, code));
    }
    return (
<<<<<<< HEAD
        <>
            <title>TalTech Scheduler</title>
            <div id="searchBar">
                <div className="search-dropdown">
                    <input
                        id="search"
                        list="Programmes"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        placeholder="Enter a subject/program"
                        autoComplete="off"
                    ></input>
                    <select
                        id="select"
                        onClick={(e) => {
                            if (e.target.id.startsWith("P_")) {
                                setSelectedStudentGroup(e.target.value);
                                setSelectedId(1);
                            } else {
                                setSelectedSubject(e.target.value);
                                setSelectedId(0);
                            }
                        }}
                    >
                        <optgroup label="Study Plans">
                            {resultProgram.map((program) => (
                                <option
                                    id={"P_" + program}
                                    key={program}
                                    value={program}
                                >
                                    {program}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Single Subjects">
                            {resultSubject.map((subject) => (
                                <option
                                    id={"S_" + subject}
                                    key={subject}
                                    value={subject}
                                >
                                    {subject}
                                </option>
                            ))}
                        </optgroup>
                    </select>
=======
        <div className="h-screen w-screen">
            <div className="h-full w-full flex">
                <div className="px-2">
                    <img src={"./logo.svg"} className="w-full my-2" alt="" />
                    <div className="my-2">
                        <Search
                            programs={resultProgram}
                            subjects={resultSubject}
                            onSubmit={onAdd}
                        ></Search>
                    </div>
                    <Overview list={list} submit={onRemove}></Overview>
                </div>
                <div className="flex-1 overflow-hidden">
                    <Timetable schedule={schedule}></Timetable>
>>>>>>> 35541d1708f281db7821c24bc5cccd4d66e977d2
                </div>
            </div>
        </div>
    );
}
