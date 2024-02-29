
/**
 * Output JSON:
 * [
 *   {
 *      "departmentId": number,
 *      "nameEt": string,
 *      "nameEn": string,
 *      "curriculums": [
 *        {
 *          "code": string,
 *          "nameEt": string,
 *          "nameEn": string,
 *          "studentGroups": [
 *            {
 *              "id": number,
 *              "code": string,
 *              "curriculumVersionId": number,
 *              "location": string,
 *              "locationEn": string,
 *              "specNameEt": string,
 *              "specNameEn": string
 *            },
 *            ...
 *          ]
 *        },
 *        ...
 *      ]
 *   },
 *   ...
 * ]
 * 
 */
async function getDepartments(timetableId) {
    const res = await fetch("https://tunniplaan.taltech.ee/tt/api/public/departments?ttId=" + (+timetableId), {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9,et;q=0.8",
            "cache-control": "no-cache",
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
        "mode": "cors",
        "credentials": "include"
    });

    const json = await res.json();

    return json["departments"];
}

module.exports.getDepartments = getDepartments;