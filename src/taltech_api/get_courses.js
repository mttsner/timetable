"use server"

export async function getCourses(timetableId) {
    const res = await fetch("https://tunniplaan.taltech.ee/tt/api/public/ac?ttId=" + (+timetableId) + "&term=", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9,et;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": "https://tunniplaan.taltech.ee/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "no-cors",
        "credentials": "include"
    });

    const json = await res.json();

    return json["subjects"];
}

module.exports.getTimetables = getTimetables;

// Use getTimetables() and filter by "currentSessDate" field in outputtes JSON
async function getTimetablesInRange(startDate, endDate) {
    const timetables = await getTimetables();
    return timetables.filter(timetable => {
        const currentSessDate = new Date(timetable["currentSessDate"]);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return currentSessDate.getTime() >= start.getTime() && currentSessDate.getTime() <= end.getTime();
    });
}

(async () => {
    const timetables = await getTimetables();
    console.log(timetables);

    // List all timetables
    timetables.forEach(timetable => {
        console.log("currentId:", timetable["currentId"], "currentName:", timetable["currentName"], "currentNameEn:", timetable["currentNameEn"], "currentSessDate:", timetable["currentSessDate"]);
    });
}