import { Moment } from "moment";

export enum UserType {
    Student,
    Teacher,
    Guardian,
    SchoolAdmin
};

export interface IRegisteredUsers {
    userType: UserType;
    userName: string;
    passwordHash: string;
    passwordNounce: string;
};

export interface IToken {
    ownedBy: IRegisteredUsers;
    expiresAt: Moment;
    grantedAt: Moment;
    token: string;
};