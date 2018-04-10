/**
 * Third Party Library Imports
 */
import { Request, Response } from "express-serve-static-core";
import { Guardian } from "../Guardian";
import { Student } from "../Student";

/**
 * Ability to assign a student/child to their guardian(s)
 */
export class AssignHandler {
    private _mockGuardianData: Guardian[];
    private _mockStudentData: Student[];

    constructor(guardianSeedData: Guardian[], studentSeedData: Student[]) {
        this._mockGuardianData = guardianSeedData;
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
        const index = this.getGuardianIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        const targetGuardian = this._mockGuardianData[index];

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

        targetGuardian.assignChildToGuardian(targetStudent);

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
        const index = this.getGuardianIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        const targetGuardian = this._mockGuardianData[index];

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

        const guardianReferenceIndex = targetGuardian.getChildren().indexOf(targetStudent);

        if (guardianReferenceIndex < 0) {
            response.sendStatus(404);
            return;
        }

        targetGuardian.disassociateChildFromGuardianAtIndex(guardianReferenceIndex);

        response.send("Removed");
    }

    /**
     *
     * @param id
     */
    private getGuardianIndex(id: string): number {
        return this._mockGuardianData.findIndex((target) => {
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