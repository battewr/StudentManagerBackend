import crypto from "crypto";
import uuid from "uuid";
import { Request, Response } from "express-serve-static-core";

export enum UserType {
    Student,
    Teacher,
    Guardian,
    SchoolAdmin
}

export interface IRegisteredUsers {
    userType: UserType;
    userName: string;
    passwordHash: string;
    passwordNounce: string;
};

interface IRawLoginInputBody {
    userName: string;
    password: string;
}

interface Map<T> {
    [key: string]: T;
}

export class LoginHandler {
    private _registeredUsers: Map<IRegisteredUsers> = {};

    public handleRegisterGuardian(request: Request, response: Response) {
        const body = request.body;

        const rawObject: IRawLoginInputBody = {
            userName: body.userName,
            password: body.password
        };

        const duplicateUser = this._registeredUsers[rawObject.userName];
        if (!!duplicateUser) {
            response.sendStatus(400);
            return;
        }

        const generatedNonce = uuid();
        const newUserObject: IRegisteredUsers = {
            userName: rawObject.userName,
            passwordNounce: generatedNonce,
            passwordHash: this.hashUserPassword(rawObject, generatedNonce),
            userType: UserType.Guardian,
        };
        this._registeredUsers[rawObject.userName] = newUserObject;
        response.send({result: "Ok!"});
    }

    public handlePost(request: Request, response: Response) {

        const body = request.body;
        const userName = body.userName;

        const targetUser = this._registeredUsers[userName];

        if (!targetUser) {
            response.sendStatus(401);
            return;
        }

        const hash = this.hashUserPassword(request.body, targetUser.passwordNounce);

        if (hash === targetUser.passwordHash) {
            response.sendStatus(200);
        } else {
            response.sendStatus(401);
        }
    }

    private hashUserPassword(user: IRawLoginInputBody, nonce: string): string {
        const hash = crypto.createHmac("sha256", nonce)
            .update(user.password)
            .digest("hex");
        return hash;
    }
}