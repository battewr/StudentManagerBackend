/**
 * Third Party Library Imports
 */
import { Request, Response } from 'express-serve-static-core'

/**
 * Internal Imports
 */
import { Student } from '../Student';

/**
 * 
 */
export class StudentHandler {

    /**
     * TODO: refactor out into a database... persist
     */
    private _mockStudentData: Student[];
   
    /**
     * .ctor
     * @param studentSeedData 
     */
    constructor(studentSeedData: Student[]) {
        this._mockStudentData = studentSeedData;
    }

    public handleGetList(request: Request, response: Response): void {
        response.send(this._mockStudentData);
    }

    /**
     * 
     * @param request 
     * @param response
     * @returns {void}
     */
    public handleGet(request: Request, response: Response): void{
        const id: string = this.getIdFromQueryString(request);
        if (!id || id === null) {
            response.sendStatus(404);
            return;
        }

        const index = this.getStudentIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        response.send(this._mockStudentData[index]);
    }

    /**
     * 
     * @param request 
     * @param response
     * @returns {void}
     */
    public handlePost(request: Request, response: Response): void {
        const body = request.body;

        if (!body) {
            response.sendStatus(400);
            return;
        }

        this._mockStudentData.push(Student.Parse(body));
        response.send('Created!');
    }

    public handlePut(request: Request, response: Response): void {
        /** parse the id from the url query string */
        const id: string = this.getIdFromQueryString(request);
        if (!id || id === null) {
            response.sendStatus(400);
            return;
        }

        /** try to find the student id in the database */
        const index = this.getStudentIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        /** 
         * load the body... the new student details being used to replace
         * the student info needs to exist and be valid JSON* 
         */
        const body = request.body;
        if (!body) {
            response.sendStatus(400);
            return;
        }

        /** parse the body and validate that the ID we are changing matches the url query string */
        const targetStudentChanges = Student.Parse(body);
        if (targetStudentChanges.getId() !== id) {
            response.sendStatus(400);
            return;
        }

        /** change the student information in the database! */
        this._mockStudentData[index] = targetStudentChanges;

        /** response to the request */
        response.send('Updated!');
    }

    /**
     * 
     * @param request 
     * @param response
     * @returns {void}
     */
    public handleDelete(request: Request, response: Response): void {
        const id: string = this.getIdFromQueryString(request);
        if (!id || id === null) {
            response.sendStatus(404);
            return;
        }

        const index = this.getStudentIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        this._mockStudentData.splice(index, 1);
        response.send('Removed');
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
}