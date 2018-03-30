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

    public handleGetList(request: Request, response: Response): void {
        response.send(this._studentList);
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

        this._studentList.splice(index, 1);
        response.send('Removed');
    }

    /**
     * 
     * @param id 
     */
    private getStudentIndex(id: string): number {
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
    private getIdFromQueryString(request: Request): string {
        const id = request.query.Id;
        if (!id) {
            return null;
        }

        return id;
    }
}