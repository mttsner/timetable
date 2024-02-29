/**
 * Output JSON:
 * [
 *   {
 *     "currentId": number,
 *     "currentName": string,
 *     "currentNameEn": string,
 *     "currentSessDate": string,
 *   },
 *   ...
 * ]
 * 
 * Example output:
 * [
 *   {
 *     "currentId": 3,
 *     "currentName": '2023/2024 kevad',
 *     "currentNameEn": '2023/2024  Spring',
 *     "currentSessDate": '2024-05-20',
 *     "nextId": null,
 *     "nextName": null,
 *     "nextNameEn": null,
 *     "isNextPublished": null
 *   }
 * ]
 */
async function getTimetables() {
    const res = await fetch("https://tunniplaan.taltech.ee/tt/api/public/timetables", {
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

    return [json];
}

module.exports.getTimetables = getTimetables;