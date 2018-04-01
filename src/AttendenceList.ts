import { Class } from "./Class";
import { Student } from "./Student";



export const MapSeedClassroomAssignments = function(classList: Class[], studentList: Student[]) {
    classList[0].assignStudentToClass(studentList[0]);
    classList[2].assignStudentToClass(studentList[1]);
    classList[1].assignStudentToClass(studentList[2]);
    classList[0].assignStudentToClass(studentList[3]);
    classList[1].assignStudentToClass(studentList[4]);
}