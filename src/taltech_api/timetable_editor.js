export function removeLayer(programJson, subjectCode) {
    let newWeekDays = { weekDays: [ { dow: "", rows: [ { startTime: "", endTime: "", subjectName: "", weekCodes: [] } ] } ] };
    newWeekDays = programJson["weekDays"].map(
        (weekDay) => weekDay["rows"].filter(
            (row) => row["subjectCode"] !== subjectCode
        )
    );
    console.log(newWeekDays);
    
    newWeekDays = newWeekDays.filter(
        (weekDay = { weekDays: [ { dow: "", rows: [ { startTime: "", endTime: "", subjectName: "", weekCodes: [] } ] } ] }) => weekDay["rows"].length > 0
    );
    
    return {
        "weekDays": newWeekDays
    };
}

export function combineLayers(programJson, otherProgramJson) {
    
    let weekDays = [
        { "dow": 1, rows: [] },
        { "dow": 2, rows: [] },
        { "dow": 3, rows: [] },
        { "dow": 4, rows: [] },
        { "dow": 5, rows: [] },
        { "dow": 6, rows: [] },
        { "dow": 7, rows: [] },
    ];

    weekDays = weekDays.map((weekDay, index) => {
        let newRows = [];
        if(programJson["weekDays"].some((day) => day["dow"] === weekDay["dow"])) {
            newRows = newRows.concat(programJson["weekDays"].find((day) => day["dow"] === weekDay["dow"])["rows"]);
        }

        if(otherProgramJson["weekDays"].some((day) => day["dow"] === weekDay["dow"])) {
            newRows = newRows.concat(otherProgramJson["weekDays"].find((day) => day["dow"] === weekDay["dow"])["rows"]);
        }

        return {
            "dow": weekDay["dow"],
            "rows": newRows
        };
    });

    weekDays = weekDays.filter((weekDay) => weekDay["rows"].length > 0);

    return {
        "weekDays": weekDays
    };
}