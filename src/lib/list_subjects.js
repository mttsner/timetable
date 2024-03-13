"use server"

export async function listSubjects(subjects, chosenSubjectCode) {

    let foundSubjects = [];

    subjects.forEach(lesson => {
        if (chosenSubjectCode === "" || lesson["code"].toLowerCase().startsWith(chosenSubjectCode.toLowerCase())) {
            foundSubjects.push(lesson["code"]);
        }
    });
    return foundSubjects;
}