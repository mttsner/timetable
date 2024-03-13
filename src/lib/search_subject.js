"use server"

import { getSubject } from "@/taltech_api/get_subject";

export async function searchSubject(timetableId, subjects, chosenSubjectCode) {
    
    let found = false;
    let subjectId;  

    subjects.forEach(subject => {
        if(found) return;

        if (subject["code"].toLowerCase().startsWith(chosenSubjectCode.toLowerCase())) {
            found = true;
            subjectId = subject["id"];
        }
    });

    if(!found) return "Not found";

    const subject = await getSubject(
        timetableId,
        subjectId
    );

    return subject;
}