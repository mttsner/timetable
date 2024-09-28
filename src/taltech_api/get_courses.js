/**
 * Get courses in timetable
 * @param {number} timetableId
 */
export async function getCourses(timetableId) {
    const res = await fetch("api/ac?ttId=" + +timetableId + "&term=");
    const json = await res.json();
    return json["subjects"];
}

// Use getTimetables() and filter by "currentSessDate" field in outputtes JSON
async function getTimetablesInRange(startDate, endDate) {
    const timetables = await getTimetables();
    return timetables.filter((timetable) => {
        const currentSessDate = new Date(timetable["currentSessDate"]);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (
            currentSessDate.getTime() >= start.getTime() &&
            currentSessDate.getTime() <= end.getTime()
        );
    });
}

/* (async () => {
    const timetables = await getTimetables();
    console.log(timetables);

    // List all timetables
    timetables.forEach(timetable => {
        console.log("currentId:", timetable["currentId"], "currentName:", timetable["currentName"], "currentNameEn:", timetable["currentNameEn"], "currentSessDate:", timetable["currentSessDate"]);
    });
}) */
