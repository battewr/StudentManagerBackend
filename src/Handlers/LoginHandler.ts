import crypto from "crypto";
import uuid from "uuid";
import { Request, Response } from "express-serve-static-core";
import { IRegisteredUsers, UserType } from "../Security/SecurityBaseTypes";
import { Dictionary } from "../Shared/Dictionary";
import { TokenManager } from "../Security/TokenManager";

interface IRawLoginInputBody {
    userName: string;
    password: string;
}

export class LoginHandler {
    private _registeredUsers: Dictionary<IRegisteredUsers> = {};
    private _tokenManager: TokenManager;

    constructor(tokenManager: TokenManager) {
        this._tokenManager = tokenManager;
    }

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
        response.send({ result: "Ok!" });
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
            const candidateToken = this._tokenManager.issueToken(targetUser);
            response.send({
                token: candidateToken.token,
                expires: candidateToken.expiresAt,
            });
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