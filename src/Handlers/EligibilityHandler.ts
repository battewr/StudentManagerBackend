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

        let availableAttenenceList: Student[] = [];

        completeEligibilityList.forEach((student: Student) => {
            if (attendenceListHash.hasOwnProperty(student.getId())) { return; }
            availableAttenenceList.push(student);
        });

        availableAttenenceList.sort((a: Student, b: Student): number => {
            return a.getName().localeCompare(b.getName());
        });

        const estimatedSize = availableAttenenceList.length;

        const takeCount = this.getTakeCount(request);
        const skipCount = this.getSkipCount(request);
        if (takeCount > 0 && skipCount > -1) {
            const startIndex = skipCount;
            const endIndex = startIndex + takeCount;

            availableAttenenceList = availableAttenenceList.slice(startIndex, endIndex);
        }

        response.send({availableAttenenceList, estimatedSize});
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
     * 0: url?id=classId&skip=0&take=pageSize
     * 1: skip=pageSize&take=pageSize
     * 2: skip=pageSize*2&take=pageSize
     * @param id
     */
    private getSkipCount(request: Request): number {
        const skipCount = request.query.skip;
        if (!skipCount) {
            return -1;
        }
        return parseInt(skipCount, 10);
    }

    /**
     * 0: url?id=classId&skip=0&take=pageSize
     * 1: skip=pageSize&take=pageSize
     * 2: skip=pageSize*2&take=pageSize
     * @param id
     */
    private getTakeCount(request: Request): number {
        const takeCount = request.query.take;
        if (!takeCount) {
            return -1;
        }
        return parseInt(takeCount, 10);
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
}