/**
 * Third Party Library Imports
 */
import { Request, Response } from 'express-serve-static-core'

/**
 * Internal Imports
 */
import { Student } from './Student';

/**
 * 
 */
export class StudentRestHandler {

    private _studentList: Student[];
   
    /**
     * .ctor
     * @param studentList 
     */
    constructor(studentList: Student[]) {
        this._studentList = studentList;
    }

    /**
     * 
     * @param request 
     * @param response
     * @returns {void}
     */
    public handleGet(request: Request, response: Response): void{
        const id: number = this.getIdFromQueryString(request);
        if (id === -1) {
            response.sendStatus(404);
            return;
        }

        const index = this.getStudentIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        response.send(this._studentList[index]);
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
            response.sendStatus(500);
            return;
        }

        this._studentList.push(Student.Parse(body));
        response.send('Created!');
    }

    /**
     * 
     * @param request 
     * @param response
     * @returns {void}
     */
    public handleDelete(request: Request, response: Response): void {
        const id: number = this.getIdFromQueryString(request);
        if (id === -1) {
            response.sendStatus(404);
            return;
        }

        const index = this.getStudentIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        this._studentList.splice(index, 1);
        response.send('Removed');
    }

    /**
     * 
     * @param id 
     */
    private getStudentIndex(id: number): number {
        return this._studentList.findIndex((target) => {
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
    private getIdFromQueryString(request: Request): number {
        const id = request.query.Id;
        if (!id) {
            return -1;
        }

        try {
            return parseInt(id, 10);
        } catch {
            return -1;
        }
    }
}