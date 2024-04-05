"use client";

import { HTMLAttributes } from "react";
import "@/app/page.css";

function Card({
    style,
    children,
    onClick,
    onMouseOver,
}: HTMLAttributes<HTMLDivElement>) {
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

export default function Schedule({ day }) {
    if (day == undefined) {
        return null;
    }
    const timeToIndex = (time: string) => {
        if (time === null) {
            return "";
        }
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

    const weekDays = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday",
        "-1": "Online",
    };

    return (
        <div className="overflow-x-auto">
            <div className="grid border-gray-600 w-full grid-flow-row grid-cols-[repeat(17,1fr)] grid-rows-[repeat(58,1fr)]">
                <div id="week" key={0} className="border-r border-b">

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
                        if (row.time === null) {
                            return (
                                <Card
                                    id="cards"
                                    className=""
                                    style={{
                                        gridRowStart: 2,
                                        gridRowEnd: 5,
                                        gridColumnStart: 1 + code[0],
                                        gridColumnEnd: 2 + code[1],
                                    }}
                                >
                                    {key === 0 ? row.subjectName : ""}
                                    <br></br>
                                    {key === 0 ? row.subjectCode : ""}
                                </Card>
                            );
                        }
                        return (
                            <Card
                                id="cards"
                                className=""
                                style={{
                                    gridRowStart:
                                        1 + timeToIndex(row.startTime),
                                    gridRowEnd: 1 + timeToIndex(row.endTime),
                                    gridColumnStart: 1 + code[0],
                                    gridColumnEnd: 2 + code[1],
                                }}
                            >
                                {key === 0 ? row.subjectName : ""}
                                <br></br>
                                {key === 0 ? row.subjectCode : ""}
                                <br></br>
                                {key === 0 ? row.time : ""}
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
