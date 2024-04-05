import ical, {ICalCalendar, ICalCalendarMethod} from 'ical-generator';



function dateDiffInDays(first, second) {        
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function parseYYYYMMDD(dateString) {
    let [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day);
}

function findRepeatance(dateArray) {
    console.log("Finding repeatance ...");

    // Try to check repeatances in steps of 7 (1 week)
    // 'repeatance < 7 * 16' is just to avoid infinite loop
    for(let repeatance = 7; repeatance < 7 * 16; repeatance += 7) {
        let found = true;
        
        // Check distance between date pairs sequentially
        for(let i = 0; i < dateArray.length - repeatance; i++) {
            if(dateDiffInDays(dateArray[i], dateArray[i + repeatance]) !== repeatance) {
                found = false;
                break;
            }

            // If the repetance is larger than the distance between
            // the two dates, return 'null'
            if(dateDiffInDays(dateArray[i], dateArray[i + repeatance]) > repeatance) {
                console.log("Repeatance not found");

                return null;
            }
        }

        if(found) {
            console.log("Repeatance found:", repeatance);

            return repeatance;
        }
    }

    console.log("Repeatance not found");

    return null;
}

/**
 * 
 * @param {ICalCalendar} cal
 * @param {Object} subjectJson
 * @returns {ical.Event}
 */
function addSubject(cal, subjectJson) {
    let description = "";
    description += `Aine kood: ${subjectJson["subjectCode"]}\n`;
    description += `Aine nimi: ${subjectJson["subjectName"]}\n`;
    description += `Õppejõud: ${subjectJson["teachers"].map((teacher) => teacher["teacherName"]).join(", ")}\n`;
    description += `Ruum: ${subjectJson["rooms"].map((room) => room["roomNo"]).join(", ")}\n`;

    const location = subjectJson["rooms"].map((room) => room["roomNo"]).join(", ");

    const repeatance = findRepeatance(subjectJson["dts"].map((dts) => parseYYYYMMDD(dts["date"])));

    if(!repeatance) {
        subjectJson["dts"].forEach((dts) => {
            cal.createEvent({
                start: dts["date"] + "T" + subjectJson["startTime"],
                end: dts["date"] + "T" + subjectJson["endTime"],
                summary: subjectJson["subjectName"],
                description,
                location,
            });
        });

        return;
    }

    cal.createEvent({
        start: subjectJson["dts"][0]["date"] + "T" + subjectJson["startTime"],
        end: subjectJson["dts"][0]["date"] + "T" + subjectJson["endTime"],
        summary: subjectJson["subjectName"],
        description,
        location,
        repeating: {
            freq: "WEEKLY",
            until: subjectJson["dts"]["date"],
            interval: repeatance / 7,
        },
    });
}

function createICal(scheduleJson) {
    let cal = ical({domain: 'taltech.ee'});
    cal.method(ICalCalendarMethod.PUBLISH);

    scheduleJson["weekDays"].forEach((weekDay) => {
        weekDay["rows"].forEach((row) => {
            addSubject(cal, row);
        });
    });

    return cal;
}

module.exports.createICal = createICal;





function downloadFile(file) {
    // Create a link and set the URL using `createObjectURL`
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = URL.createObjectURL(file);
    link.download = file.name;
  
    // It needs to be added to the DOM so it can be clicked
    document.body.appendChild(link);
    link.click();
  
    // To make this work on Firefox we need to wait
    // a little while before removing it.
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        link.parentNode.removeChild(link);
    }, 0);
}

function downloadICal(scheduleJson) {
    const cal = createICal(scheduleJson);

    const file = new Blob([cal.toString()], {type: "text/calendar"});
    file.name = "schedule.ics";

    downloadFile(file);
}

module.exports.downloadICal = downloadICal;