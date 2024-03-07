"use server"

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
export async function getTimetables() {
    const res = await fetch("https://tunniplaan.taltech.ee/tt/api/public/timetables", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-User": "?1",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "method": "GET",
        "mode": "no-cors"
    });


    /* const res = await fetch("https://tunniplaan.taltech.ee/tt/api/public/timetables", {
        "headers": {
            "accept": "application/json, text/plain, **",
            "accept-language": "en-US,en;q=0.9,et;q=0.8",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-site": "same-origin"
        },
        "referrer": "https://tunniplaan.taltech.ee/",
        "body": null,
        "method": "GET",
        "mode": "no-cors",
        "credentials": "include",
    }); */

    const json = await res.json();

    return [json];
}
