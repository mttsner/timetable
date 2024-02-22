async function ical(code, id) {
  const res = await fetch(
    `https://tunniplaan.taltech.ee/tt/api/public/ical`, {
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
    "body": `{\"code\":\"${code}\",\"timetableId\":3,\"lang\":\"et\",\"subjectId\":\"${id}\"}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });

  const json = await res.json();

  return json["content"];
}

module.exports.ical = ical;