"use server"

const { getProgram } = require('../taltech_api/get_program');

export async function search(timetableId, departments, chosenCurriculumCode) {
    
    let found = false;
    let chosenDepartmentID;
    let chosenProgramID;
    let chosenCurriculumVersionID;    

    departments.forEach(department => {
        if(found) return;

        department["curriculums"].forEach(curriculum => {
            if(found) return;

            curriculum["studentGroups"].forEach(studentGroup => {
                if(found) return;

                if (studentGroup["code"].toLowerCase().startsWith(chosenCurriculumCode.toLowerCase())) {
                    found = true;
                    chosenDepartmentID = department["departmendID"];
                    chosenProgramID = studentGroup["id"];
                    chosenCurriculumVersionID = studentGroup["curriculumVersionId"];
                }
            });
        });
    });

    if(!found) return "Not found";

    const program = await getProgram(
        chosenProgramID,
        chosenCurriculumVersionID,
        chosenDepartmentID,
        timetableId
    );

    return program;
}