const { getTimetables } = require('../taltech_api/get_timetables');
const { getDepartments } = require('../taltech_api/get_departments');
const { getProgram } = require('../taltech_api/get_program');

const chosenCurriculumCode = document.getElementById("search").value;

async function Search() {
    const timetables = await getTimetables();
    const chosenTimetableId = timetables[0]["currentId"]

    const departments = await getDepartments(chosenTimetableId);

    let chosenDepartmentID;
    let chosenProgramID;
    let chosenCurriculumVersionID;

    departments.forEach(department => {
        console.log("departmentId:", department["departmentId"], "nameEt:", department["nameEt"]);

        department["curriculums"].forEach(curriculum => {
            console.log("   ", "code:", curriculum["code"], "nameEt:", curriculum["nameEt"]);

            curriculum["studentGroups"].forEach(studentGroup => {
                console.log("       ", "id:", studentGroup["id"], "code:", studentGroup["code"], "curriculumVersionId:", studentGroup["curriculumVersionId"], "nameEt:", studentGroup["specNameEt"]);
                if (chosenCurriculumCode.localeCompare(studentGroup["code"] == 0)) {
                    chosenDepartmentID = department["departmendID"];
                    chosenProgramID = studentGroup["id"];
                    chosenCurriculumVersionID = studentGroup["curriculumVersionId"];
                }
            });
        });
    });

    const program = await getProgram(
        chosenProgramID,
        chosenCurriculumVersionID,
        chosenDepartmentID,
        chosenTimetableId
    );
    document.getElementById("result").innerHTML = JSON.stringify(program, null, 2);
}