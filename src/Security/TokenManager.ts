const uuid = require("uuid");
const moment = require("moment");

import { Dictionary } from "../Shared/Dictionary";
import { IToken, IRegisteredUsers } from "./SecurityBaseTypes";



/**
 * Token Manager
 */
export class TokenManager {
    private _tokenList: Dictionary<IToken[]>;
    public constructor() {
        this._tokenList = {};
    }

    public issueToken(toUser: IRegisteredUsers): IToken {
        const now = moment().utc();
        const newToken: IToken = {
            ownedBy: toUser,
            token: uuid(),
            expiresAt: now.clone().add(1, "h"),
            grantedAt: now,
        };

        if (!this._tokenList.hasOwnProperty(newToken.token)) {
            this._tokenList[newToken.token] = [];
        }

        this._tokenList[newToken.token].push(newToken);

        return newToken;
    }

    public refreshToken(tokenForRefresh: string): IToken {
        if (!this._tokenList.hasOwnProperty(tokenForRefresh)) {
            return null;
        }

        const candidateTokenList = this._tokenList[tokenForRefresh];

        const removedExpiredTokens = candidateTokenList.filter((token: IToken) => {
            if (moment().utc().isAfter(token.expiresAt)) {
                return false;
            }
            return true;
        });

        this._tokenList[tokenForRefresh] = removedExpiredTokens;

        // TODO: rework this into a O(1) lookup
        const candidateKey = removedExpiredTokens.filter((candidateToken) => {
            return candidateToken.token === tokenForRefresh;
        });

        if (!candidateKey || candidateKey.length < 1) {
            return null;
        }

        const now = moment().utc();
        candidateKey[0].expiresAt = now.clone().add(1, "h");
        candidateKey[0].grantedAt = now;
        return candidateKey[0];
    }

    public isValidToken(tokenToValidate: string): boolean {
        if (!this._tokenList.hasOwnProperty(tokenToValidate)) {
            return false;
        }

        const candidateTokenList = this._tokenList[tokenToValidate];

        const now = moment().utc();
        const removedExpiredTokens = candidateTokenList.filter((token: IToken) => {
            if (now.isAfter(token.expiresAt)) {
                return false;
            }
            return true;
        });

        this._tokenList[tokenToValidate] = removedExpiredTokens;

        // TODO: rework into a O(1) op...
        const candidateKey = removedExpiredTokens.filter((candidateToken) => {
            return candidateToken.token === tokenToValidate;
        });

        if (!!candidateKey) {
            return candidateKey.length > 0;
        }

        return false;
    }
}