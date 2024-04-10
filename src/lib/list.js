export function listSubjects(subjects, chosenSubjectCode) {

    let foundSubjects = [];

    subjects.forEach(lesson => {
        if (chosenSubjectCode === "" || lesson["code"].toLowerCase().startsWith(chosenSubjectCode.toLowerCase())) {
            foundSubjects.push(lesson["code"]);
        }
    });
    return foundSubjects;
}


export function listSelected(schedule) {

    let foundSubjects = [];

    if (!schedule || !schedule["weekDays"]) {
        return []
    }

    schedule.weekDays.forEach(weekDay => {
        weekDay.rows.forEach(row => {
            if (foundSubjects.includes(row["subjectCode"]) === false) {
                foundSubjects.push(row["subjectCode"]);
            }
        })
    });
    return foundSubjects;
}


export function listPrograms(departments, chosenCurriculumCode) {
    
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