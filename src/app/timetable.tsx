import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Schedule from "./schedule";

enum WeekDays {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
    Online = -1

}

export default function Timetable({ schedule }) {
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
                <Schedule day={schedule.weekDays[WeekDays.Monday]}/>
            </TabsContent>
            <TabsContent value="tuesday">
                <Schedule day={schedule.weekDays[WeekDays.Tuesday]}/>
            </TabsContent>
            <TabsContent value="wednesday">
                <Schedule day={schedule.weekDays[WeekDays.Wednesday]}/>
            </TabsContent>
            <TabsContent value="thursday">
                <Schedule day={schedule.weekDays[WeekDays.Thursday]}/>
            </TabsContent>
            <TabsContent value="friday">
                <Schedule day={schedule.weekDays[WeekDays.Friday]}/>
            </TabsContent>
            <TabsContent value="saturday">
                <Schedule day={schedule.weekDays[WeekDays.Saturday]}/>
            </TabsContent>
            <TabsContent value="sunday">
                <Schedule day={schedule.weekDays[WeekDays.Saturday]}/>
            </TabsContent>
            <TabsContent value="online">
                <Schedule day={schedule.weekDays[WeekDays.Online]}/>
            </TabsContent>
        </Tabs>
    );
}
