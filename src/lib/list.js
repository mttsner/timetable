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


export async function listSelected(schedule) {

    let foundSubjects = [];

    schedule["weekDays"].forEach(weekDay => {
        weekDay.rows.forEach(row => {
            if (foundSubjects.includes(row["subjectCode"]) === false) {
                foundSubjects.push(row["subjectCode"]);
            }
        })
    });
    return foundSubjects;
}


export async function listPrograms(departments, chosenCurriculumCode) {
    
    let curriculums = [];

    departments.forEach(department => {

        department["curriculums"].forEach(curriculum => {

            curriculum["studentGroups"].forEach(studentGroup => {
                if (chosenCurriculumCode === "" || studentGroup["code"].toLowerCase().startsWith(chosenCurriculumCode.toLowerCase())) {
                    curriculums.push(studentGroup["code"]);
                }
            });
        });
    });

    return curriculums;
}