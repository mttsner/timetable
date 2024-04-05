import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Schedule from "./schedule";

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

export default function Timetable({ schedule }) {
    console.log(schedule);
    return (
        <Tabs defaultValue="monday" className="w-full">
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
            <TabsContent value="monday">
                <Schedule
                    day={schedule.weekDays.find(
                        (day) => day.dow == WeekDays.Monday
                    )}
                />
            </TabsContent>
            <TabsContent value="tuesday">
                <Schedule
                    day={schedule.weekDays.find(
                        (day) => day.dow == WeekDays.Tuesday
                    )}
                />
            </TabsContent>
            <TabsContent value="wednesday">
                <Schedule
                    day={schedule.weekDays.find(
                        (day) => day.dow == WeekDays.Wednesday
                    )}
                />
            </TabsContent>
            <TabsContent value="thursday">
                <Schedule
                    day={schedule.weekDays.find(
                        (day) => day.dow == WeekDays.Thursday
                    )}
                />
            </TabsContent>
            <TabsContent value="friday">
                <Schedule
                    day={schedule.weekDays.find(
                        (day) => day.dow == WeekDays.Friday
                    )}
                />
            </TabsContent>
            <TabsContent value="saturday">
                <Schedule
                    day={schedule.weekDays.find(
                        (day) => day.dow == WeekDays.Saturday
                    )}
                />
            </TabsContent>
            <TabsContent value="sunday">
                <Schedule
                    day={schedule.weekDays.find(
                        (day) => day.dow == WeekDays.Sunday
                    )}
                />
            </TabsContent>
            <TabsContent value="online">
                <Schedule
                    day={schedule.weekDays.find(
                        (day) => day.dow == WeekDays.Online
                    )}
                />
            </TabsContent>
        </Tabs>
    );
}
