"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    combineSchedules,
    removeSubject,
} from "@/taltech_api/timetable_editor";
import Search from "./search";
import Overview from "./overview";
import Timetable from "./timetable";

interface TimetableState {
    timetables: { [key: number]: any };
    currentTimetableId: number;
    setCurrentTimetableId: (timetableId: number) => void;
    addSubject: (subject: any) => void;
    removeSubject: (subject: string) => void;
}

export const useTimetableStore = create<TimetableState>()(
    persist(
        (set) => ({
            timetables: {
                [3]: {
                    weekDays: [],
                },
            },
            currentTimetableId: 3,
            setCurrentTimetableId: (timetableId: number) =>
                set({ currentTimetableId: timetableId }),
            addSubject: (subject) =>
                set((state) => ({
                    ...state,
                    timetables: {
                        ...state.timetables,
                        [state.currentTimetableId]: combineSchedules(
                            state.timetables[state.currentTimetableId],
                            subject
                        ),
                    },
                })),
            removeSubject: (code) =>
                set((state) => ({
                    ...state,
                    timetables: {
                        ...state.timetables,
                        [state.currentTimetableId]: removeSubject(
                            state.timetables[state.currentTimetableId],
                            code
                        ),
                    },
                })),
        }),
        {
            name: "timetable-storage",
        }
    )
);

export default function Home() {
    // Current timetable id should be fetched on page startup
    //const timetableId = (await getTimetables())[0]["currentId"];
    return (
        <div className="h-screen w-screen">
            <div className="h-full w-full flex">
                <div className="px-2">
                    <img src={"./logo.svg"} className="w-full my-2" alt="" />
                    <div className="my-2">
                        <Search></Search>
                    </div>
                    <Overview></Overview>
                </div>
                <div className="flex-1 overflow-hidden">
                    <Timetable></Timetable>
                </div>
            </div>
        </div>
    );
}
