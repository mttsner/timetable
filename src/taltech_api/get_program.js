"use server"

/**
 * Returns the timetable of selected program.
 * 
 * Example output JSON:
 * {
 *   "weekDays": [
 *     {
 *       "dow": 1,
 *       "rows": [
 *         {
 *           "time": "09:00 - 15:45",
 *           "subjectCode": "ITC8310",
 *           "subjectName": "Mobiiltelefoni digitaalne ekspertiis",
 *           "subjectNameEn": "Mobile Phone Forensics",
 *           "language": "KEEL_EN",
 *           "required": "NOT_COMPULSORY",
 *           "type": "AINEOSAD_H",
 *           "teachers": [
 *             {
 *               "teacherName": "Matthew James Sorell",
 *               "teacherOccupation": "kaasatud professor",
 *               "teacherOccupationEn": "adjunct professor",
 *               "lastRecognitionYear": null,
 *               "dts": [
 *                 "2024-03-18"
 *               ]
 *             }
 *           ],
 *           "rooms": [
 *             {
 *               "roomNo": "ICT-403",
 *               "dts": [
 *                 "2024-03-18"
 *               ]
 *             }
 *           ],
 *           "weekCodes": [
 *             "NADAL_8"
 *           ],
 *           "dts": [
 *             {
 *               "date": "2024-03-18",
 *               "tetId": 65284
 *             }
 *           ],
 *           "syllabusId": null,
 *           "addInfo": null,
 *           "isDistance": null,
 *           "weekType": "EVEN",
 *           "startTime": "09:00:00",
 *           "endTime": "15:45:00",
 *           "subjectAddInfo": null,
 *           "dow": 1,
 *           "sgs": "IVCM21, IVCM22",
 *           "eventId": null,
 *           "subgroupCode": null
 *         },
 *         ...
 *       ]
 *     },
 *     ...
 *   ]
 * }
 */
async function getProgram(programId, curriculumVersionId, departmentId, timetableId) {
    const res = await fetch("https://tunniplaan.taltech.ee/tt/api/public/search", {
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
        "body": JSON.stringify({
            mode: "OTHER",
            page: 1,
            size: 1000,
            sgId: programId,
            curriculumVersionId: curriculumVersionId,
            departmentId: departmentId,
            ttId: timetableId,
        }),
        "method": "POST",
        "mode": "no-cors",
        "credentials": "include"
    });

    const json = await res.json();

    return json;
}

module.exports.getProgram = getProgram;