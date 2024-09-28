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
    const res = await fetch(
        "api/timetables"
    );

    const json = await res.json();

    return json;
}
