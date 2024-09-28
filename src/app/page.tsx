import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    combineSchedules,
    removeSubject,
} from "@/taltech_api/timetable_editor";
import { getTimetables } from "@/taltech_api/get_timetables";
import Search from "./search";
import Overview from "./overview";
import Timetable from "./timetable";
import Export from "./export";
import { useEffect } from "react";

interface TimetableState {
    subjects: {
        [key: number]: [
            {
                subjectId: string;
                subjectCode: string;
            }
        ];
    };
    timetables: { [key: number]: any };
    currentTimetableId: number;
    setCurrentTimetableId: (timetableId: number) => void;
    addSubject: (subject: string) => void;
    removeSubject: (subject: string) => void;
}

export const useTimetableStore = create<TimetableState>()(
    persist(
        (set, get) => ({
            subjects: [],
            timetables: {
                [0]: {
                    weekDays: [],
                },
                [1]: {
                    weekDays: [],
                },
                [2]: {
                    weekDays: [],
                },
                [3]: {
                    weekDays: [],
                },
                [4]: {
                    weekDays: [],
                },
                [5]: {
                    weekDays: [],
                },
            },
            currentTimetableId: 0,
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
            partialize: (state) => ({
                subjects: state.subjects,
            }),
        }
    )
);

export default function Home() {
    let setCurrentTimetableId = useTimetableStore((state) => state.setCurrentTimetableId);
    useEffect(() => {
        (async () => {
            let timetable = await getTimetables()
            setCurrentTimetableId(timetable.currentId);
        })()
    })
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
                    <Export></Export>
                </div>
            </div>
        </div>
    );
}
