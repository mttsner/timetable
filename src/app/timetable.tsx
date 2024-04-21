import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Schedule from "./schedule";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTimetableStore } from "./page";

enum WeekDays {
    Monday = 1,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
    Online = -1,
}

function ScheduleTab({ day }: any) {
    return (
        <ScrollArea className="h-full">
            <Schedule day={day} />
            <ScrollBar orientation="vertical"></ScrollBar>
            <ScrollBar orientation="horizontal"></ScrollBar>
        </ScrollArea>
    );
}

export default function Timetable() {
    // Global timetable state
    const schedule = useTimetableStore(
        (state) => state.timetables[state.currentTimetableId]
    );
    
    return (
        <Tabs defaultValue="monday" className="h-full w-full flex flex-col ">
            <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="monday">Esmaspäev</TabsTrigger>
                <TabsTrigger value="tuesday">Teisipäev</TabsTrigger>
                <TabsTrigger value="wednesday">Kolmapäev</TabsTrigger>
                <TabsTrigger value="thursday">Neljapäev</TabsTrigger>
                <TabsTrigger value="friday">Reede</TabsTrigger>
                <TabsTrigger value="saturday">Laupäev</TabsTrigger>
                <TabsTrigger value="sunday">Pühapäev</TabsTrigger>
                <TabsTrigger value="online">Distants</TabsTrigger>
            </TabsList>
            <TabsContent value="monday" className="flex-1 overflow-hidden">
                <ScheduleTab
                    day={schedule.weekDays.find(
                        (day: any) => day.dow == WeekDays.Monday
                    )}
                />
            </TabsContent>
            <TabsContent value="tuesday" className="flex-1 overflow-hidden">
                <ScheduleTab
                    day={schedule.weekDays.find(
                        (day: any) => day.dow == WeekDays.Tuesday
                    )}
                />
            </TabsContent>
            <TabsContent value="wednesday" className="flex-1 overflow-hidden">
                <ScheduleTab
                    day={schedule.weekDays.find(
                        (day: any) => day.dow == WeekDays.Wednesday
                    )}
                />
            </TabsContent>
            <TabsContent value="thursday" className="flex-1 overflow-hidden">
                <ScheduleTab
                    day={schedule.weekDays.find(
                        (day: any) => day.dow == WeekDays.Thursday
                    )}
                />
            </TabsContent>
            <TabsContent value="friday" className="flex-1 overflow-hidden">
                <ScheduleTab
                    day={schedule.weekDays.find(
                        (day: any) => day.dow == WeekDays.Friday
                    )}
                />
            </TabsContent>
            <TabsContent value="saturday" className="flex-1 overflow-hidden">
                <ScheduleTab
                    day={schedule.weekDays.find(
                        (day: any) => day.dow == WeekDays.Saturday
                    )}
                />
            </TabsContent>
            <TabsContent value="sunday" className="flex-1 overflow-hidden">
                <ScheduleTab
                    day={schedule.weekDays.find(
                        (day: any) => day.dow == WeekDays.Sunday
                    )}
                />
            </TabsContent>
            <TabsContent value="online" className="flex-1 overflow-hidden">
                <ScheduleTab
                    day={schedule.weekDays.find(
                        (day: any) => day.dow == WeekDays.Online
                    )}
                />
            </TabsContent>
        </Tabs>
    );
}
