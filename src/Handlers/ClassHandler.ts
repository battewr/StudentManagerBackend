/**
 * Third Party Library Imports
 */
import { Request, Response } from 'express-serve-static-core'
import { Class } from '../Class';

export class ClassHandler {
    private _mockClassData: Class[];
    constructor(classSeedData: Class[]) {
        this._mockClassData = classSeedData;
    }

    public handleGet(request: Request, response: Response): void {
        const id: string = this.getIdFromQueryString(request);
        if (!id || id === null) {
            response.send(this._mockClassData);
            return;
        }

        const index = this.getClassIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        response.send(this._mockClassData[index]);
    }

    public handlePost(request: Request, response: Response): void {
        const body = request.body;

        if (!body) {
            response.sendStatus(400);
            return;
        }

        this._mockClassData.push(Class.Parse(body));
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
        const index = this.getClassIndex(id);
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
        const targetClassChanges = Class.Parse(body);
        if (targetClassChanges.getId() !== id) {
            response.sendStatus(400);
            return;
        }

        /** change the student information in the database! */
        this._mockClassData[index] = targetClassChanges;

        /** response to the request */
        response.send('Updated!');
    }

    public handleDelete(request: Request, response: Response) {
        const id: string = this.getIdFromQueryString(request);
        if (!id || id === null) {
            response.sendStatus(404);
            return;
        }

        const index = this.getClassIndex(id);
        if (index < 0) {
            response.sendStatus(404);
            return;
        }

        this._mockClassData.splice(index, 1);
        response.send('Removed');
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