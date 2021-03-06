export class Student {
    private _name: string;
    private _id: string;
    private _grade: string;
    private _profilePictureLink: string;

    /**
     * .ctor()
     * @param inputObject
     */
    constructor(inputObject: any) {
        this._name = inputObject.Name;
        this._id = inputObject.Id;
        this._grade = inputObject.Grade;
        this._profilePictureLink = inputObject.ProfilePicture;
    }

    /**
     *
     * @param inputObject
     * @returns {Student}
     */
    public static Parse(inputObject: any): Student {
        if (!this._validate(inputObject) ) {
            throw "Invalid input object missing properties!";
        }
        return new Student(inputObject);
    }

    /**
     * @returns {string}
     */
    public getId(): string {
        return this._id;
    }

    public getGrade(): string {
        return this._grade;
    }

    public getName(): string {
        return this._name;
    }

    /**
     *
     * @param input input from rest engine?
     * @returns {boolean} true if the object is valid to create a student!
     */
    private static _validate(input: any): boolean {
        if (input.hasOwnProperty("Name") &&
            input.hasOwnProperty("Id") &&
            input.hasOwnProperty("Grade") &&
            input.hasOwnProperty("ProfilePicture")) {
            return true;
        }
        return false;
    }
}