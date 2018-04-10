import { Class } from "./Class";
import { Guardian } from "./Guardian";
import { Student } from "./Student";

export const MapSeedClassroomAssignments = function(classList: Class[], studentList: Student[]) {
    classList[0].assignStudentToClass(studentList[0]);
    classList[2].assignStudentToClass(studentList[1]);
    classList[1].assignStudentToClass(studentList[2]);
    classList[0].assignStudentToClass(studentList[3]);
    classList[1].assignStudentToClass(studentList[4]);
};

export const MapSeedGuardianAssignments = function(guardianList: Guardian[], studentList: Student[]) {
    guardianList[0].assignChildToGuardian(studentList[0]);
    guardianList[1].assignChildToGuardian(studentList[1]);
    guardianList[2].assignChildToGuardian(studentList[2]);
    guardianList[3].assignChildToGuardian(studentList[3]);
    guardianList[4].assignChildToGuardian(studentList[4]);
};
