/**
 * Third Party Library Imports
 */
import { Request, Response } from "express-serve-static-core";
import { Class } from "../Class";
import { Student } from "../Student";

export class EligibilityHanlder {
    private _mockClassData: Class[];
    private _mockStudentData: Student[];

    constructor(classSeedData: Class[], studentSeedData: Student[]) {
        this._mockClassData = classSeedData;
        this._mockStudentData = studentSeedData;
    }

    public handleGet(request: Request, response: Response) {
        /** parse the id from the url query string */
        /** url?Id=NNNNNNNN (get the value of Ns) */
        const id: string = this.getIdFromQueryString(request);
        if (!id || id === null) {
            response.sendStatus(400);
            return;
        }

        const index = this.getClassIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        const targetClass = this._mockClassData[index];
        if (!targetClass || !targetClass.getEligibilityGrade) {
            console.error("Target class not found in object after successful index lookup");
            response.sendStatus(500);
            return;
        }

        const completeEligibilityList = this.getAllEligibleStudents(targetClass.getEligibilityGrade());
        const attendenceListHash = targetClass.getAttendenceListHash();

        const availableAttenenceList: Student[] = [];

        completeEligibilityList.forEach((student: Student) => {
            if (attendenceListHash.hasOwnProperty(student.getId())) { return; }
            availableAttenenceList.push(student);
        });

        response.send(availableAttenenceList);
    }

    private getAllEligibleStudents(eligiblityGrade: string) {
        const returnStudentList: Student[] = this._mockStudentData.filter((target: Student) => {
            return target.getGrade() === eligiblityGrade;
        });
        return returnStudentList;
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