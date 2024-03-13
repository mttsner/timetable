"use server"

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