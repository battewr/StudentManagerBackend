import { Student } from "./Student";

export class Guardian {
    private _id: string;
    private _name: string;
    private _email: string;

    private _studentList: Student[];

    constructor(inputObject: any) {
        this._id = inputObject.Id;
        this._name = inputObject.Name;
        this._email = inputObject.Email;

        this._studentList = [];
    }

    public getId() {
        return this._id;
    }

    public getChildren(): Student[] {
        return this._studentList;
    }

    public getAttendenceListHash(): Object {
        const returnStudentHash: any = {};
        this._studentList.forEach((student: Student) => {
            if (!!returnStudentHash.hasOwnProperty(student.getId())) {
                console.error("Invalid state; duplicate primary keys found!");
                return;
            }
            returnStudentHash[student.getId()] = student;
        });
        return returnStudentHash;
    }

    public disassociateChildFromGuardian(student: Student) {
        const index = this._studentList.indexOf(student);
        if (index < 0) {
            throw "Student target not found!";
        }
        this.disassociateChildFromGuardianAtIndex(index);
    }

    public disassociateChildFromGuardianAtIndex(studentIndex: number) {
        this._studentList.splice(studentIndex, 1);
    }

    public assignChildToGuardian(student: Student) {
        this._studentList.push(student);
    }

    /**
     *
     * @param inputObject
     * @returns {Student}
     */
    public static Parse(inputObject: any): Guardian {
        if (!this._validate(inputObject)) {
            throw "Invalid input object missing properties!";
        }
        return new Guardian(inputObject);
    }
    /**
     *
     * @param input input from rest engine?
     * @returns {boolean} true if the object is valid to create a student!
     */
    private static _validate(input: any): boolean {
        if (input.hasOwnProperty("Name") &&
            input.hasOwnProperty("Id") &&
            input.hasOwnProperty("Email")) {
            return true;
        }
        return false;
    }

}