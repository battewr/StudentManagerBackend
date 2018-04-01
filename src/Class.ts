export class Class {
    private _id: string;
    private _name: string;
    private _semester: string;
    private _year: string;

    constructor(inputObject: any) {
        this._id = inputObject.Id;
        this._name = inputObject.Name;
        this._semester = inputObject.Semester;
        this._year = inputObject.Year;
    }

    public getId() {
        return this._id;
    }
    
    /**
     * 
     * @param inputObject 
     * @returns {Student}
     */
    public static Parse(inputObject: any): Class {
        if (!this._validate(inputObject) ) {
            throw 'Invalid input object missing properties!';
        }
        return new Class(inputObject);
    }
    /**
     * 
     * @param input input from rest engine?
     * @returns {boolean} true if the object is valid to create a student!
     */
    private static _validate(input: any): boolean {
        if (input.hasOwnProperty('Name') &&
            input.hasOwnProperty('Id') &&
            input.hasOwnProperty('Semester') &&
            input.hasOwnProperty('Year')) {
            return true;
        }
        return false;
    }

}