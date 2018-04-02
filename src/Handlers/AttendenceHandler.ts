/**
 * Third Party Library Imports
 */
import { Request, Response } from "express-serve-static-core";
import { Class } from "../Class";
import { Student } from "../Student";

export class AttendenceHandler {
    private _mockClassData: Class[];
    private _mockStudentData: Student[];

    constructor(classSeedData: Class[], studentSeedData: Student[]) {
        this._mockClassData = classSeedData;
        this._mockStudentData = studentSeedData;
    }

    /**
     * add an attendee to a class
     * @param request
     * @param response
     */
    public handlePut(request: Request, response: Response): void {
        /** parse the id from the url query string */
        const id: string = this.getIdFromQueryString(request);
        if (!id || id === null) {
            response.sendStatus(400);
            return;
        }

        /** try to find the student id in the database */
        const index = this.getClassIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        const targetClass = this._mockClassData[index];

        const studentId: string = this.getStudentIdFromQueryString(request);
        if (!studentId || studentId === null) {
            response.sendStatus(400);
            return;
        }

        /** try to find the student id in the database */
        const studentIndex = this.getStudentIndex(studentId);
        if (studentIndex < 0) {
            response.sendStatus(404);
            return;
        }

        const targetStudent = this._mockStudentData[studentIndex];

        targetClass.assignStudentToClass(targetStudent);

        /** response to the request */
        response.send("Updated!");
    }

    public handleDelete(request: Request, response: Response) {
        /** parse the id from the url query string */
        const id: string = this.getIdFromQueryString(request);
        if (!id || id === null) {
            response.sendStatus(400);
            return;
        }

        /** try to find the student id in the database */
        const index = this.getClassIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        const targetClass = this._mockClassData[index];

        const studentId: string = this.getStudentIdFromQueryString(request);
        if (!studentId || studentId === null) {
            response.sendStatus(400);
            return;
        }

        /** try to find the student id in the database */
        const studentIndex = this.getStudentIndex(studentId);
        if (studentIndex < 0) {
            response.sendStatus(404);
            return;
        }
        const targetStudent = this._mockStudentData[studentIndex];

        const attendenceIndex = targetClass.getAttendenceList().indexOf(targetStudent);

        if (attendenceIndex < 0) {
            response.sendStatus(404);
            return;
        }

        targetClass.removeStudentFromAttendenceAtIndex(attendenceIndex);

        response.send("Removed");
    }

    /**
     *
     * @param id
     */
    private getClassIndex(id: string): number {
        return this._mockClassData.findIndex((target) => {
            if (target.getId() === id) {
                return true;
            }
            return false;
        });
    }

    /**
     *
     * @param id
     */
    private getStudentIndex(id: string): number {
        return this._mockStudentData.findIndex((target) => {
            if (target.getId() === id) {
                return true;
            }
            return false;
        });
    }

    /**
     *
     * @param request
     */
    private getIdFromQueryString(request: Request): string {
        const id = request.query.Id;
        if (!id) {
            return null;
        }

        return id;
    }

    /**
     *
     * @param request
     */
    private getStudentIdFromQueryString(request: Request): string {
        const id = request.query.StudentId;
        if (!id) {
            return null;
        }

        return id;
    }
}