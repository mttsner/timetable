import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { generateLayout } from "@/lib/layout";
import { useState } from "react";

function Card({ style, children, className, code }: any) {
    const [isHover, setIsHover] = useState(false);

    return (
        <HoverCard openDelay={300}>
            <HoverCardTrigger
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                style={{
                    ...style,
                    marginLeft: isHover ? "0" : style.marginLeft,
                    marginRight: isHover ? "0" : style.marginRight,
                }}
                className={
                    "shadow-md p-1 rounded border hover:z-30 hover:text-base transition-all duration-300" +
                    className
                }
            >
                {code}
            </HoverCardTrigger>
            <HoverCardContent side="right" align="start">
                {children}
            </HoverCardContent>
        </HoverCard>
    );
}

export default function Schedule({ day }: any) {
    if (day == undefined) {
        return null;
    }

    const timeToIndex = (time: string): number => {
        let times = time.split(":");
        // Convert time to grid index
        // The grid is made up of 15 minute cells
        // The first cell is 08:00 and the last cell is 22:00
        let hour = (+times[0] - 8) * 4;
        let minute = +times[1] / 15;

        return hour + minute + 1; // Css grid index starts at 1
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

    return (
        <div className="grid border-gray-600 grid-flow-row grid-cols-[repeat(17,1fr)] grid-rows-[repeat(58,1fr)]">
            <div id="week" key={0} className="border-r border-b"></div>
            {[...Array(16)].map((x, i) => (
                <div
                    id="week"
                    className="border-r border-b min-w-20"
                    key={i + 1}
                >
                    Nädal {i + 1}
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
            {generateLayout(day.rows).map((week) =>
                week.map((group) =>
                    group.items.map((item) => {
                        if (item.row.time === null) {
                            return null
                        }
                        return (
                            <Card
                                code={item.row.subjectCode}
                                key={item.id}
                                className={
                                    group.cols !== 1
                                        ? " text-[0] hover:backdrop-blur-sm "
                                        : " hover:brightness-110"
                                }
                                style={{
                                    marginLeft: `${
                                        item.pos * (100 / group.cols)
                                    }%`,
                                    marginRight: `${
                                        (group.cols - (item.pos + 1)) *
                                        (100 / group.cols)
                                    }%`,
                                    gridRowStart:
                                        1 + timeToIndex(item.row.startTime),
                                    gridRowEnd: 1 + timeToIndex(item.row.endTime),
                                    gridColumnStart: 1 + group.week,
                                    gridColumnEnd: 2 + group.week,
                                    backgroundColor: `hsla(${item.color[0]},${item.color[1]}%,${item.color[2]}%, 0.5)`,
                                    borderColor: `hsla(${item.color[0]},${item.color[1]}%,${item.color[2]}%, 0.9)`,
                                    color: `hsl(${item.color[0]},${
                                        item.color[1]
                                    }%,${40}%)`,
                                }}
                            >
                                {item.row.subjectName}
                                <br></br>
                                {item.row.subjectCode}
                                <br></br>
                                {item.row.time}
                                <br></br>
                                {"Cols: " + group.cols}
                                <br></br>
                                {"Pos: " + item.pos}
                                <br></br>
                                {"Draw: " + item.id}
                                <br></br>
                                {"GroupId: " + group.id}
                                <br></br>
                                {group.method}
                            </Card>
                        );
                    })
                )
            )}
        </div>
    );
}