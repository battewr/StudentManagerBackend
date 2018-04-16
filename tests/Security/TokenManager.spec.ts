
const moment = require("moment");
import { assert, expect } from "chai";

import { TokenManager } from "../../src/Security/TokenManager";

const dummyUser = {
    userName: "learn2dev",
    passwordHash: null,
    passwordNounce: null,
    userType: null
};

describe("Token manager issue tokens", () => {
    it("should grant a token to a user with no tokens yet", () => {
        const tokenManager = new TokenManager();

        const token = tokenManager.issueToken(dummyUser);
        assert.isNotNull(token);
    });

    it("should grant a second token to a user who already has a token", () => {
        const tokenManager = new TokenManager();
        const token1 = tokenManager.issueToken(dummyUser);
        const token2 = tokenManager.issueToken(dummyUser);

        assert.isNotNull(token1);
        assert.isNotNull(token2);

        assert.notDeepEqual(token1, token2);
    });

    it("should grant a token which expires an hour from now", () => {
        const tokenManager = new TokenManager();
        const token1 = tokenManager.issueToken(dummyUser);

        assert.isNotNull(token1);
        assert.isTrue(token1.expiresAt.isSame(token1.grantedAt.clone().add(1, "h")));
    });

    it("should be able to grant tokens to more then one user", () => {
        const dummyUser2 = {
            userName: "learn2art",
            passwordHash: null,
            passwordNounce: null,
            userType: null
        };

        const tokenManager = new TokenManager();
        const token1 = tokenManager.issueToken(dummyUser);
        const token2 = tokenManager.issueToken(dummyUser2);

        assert.isNotNull(token1);
        assert.isNotNull(token2);

        assert.notDeepEqual(token1, token2);
    });
});

describe("Token manager refresh token", () => {
    it("should fail gracefully if asked to refresh a token that doesnt exist on user with no tokens", () => {
        const tokenManager = new TokenManager();
        const result = tokenManager.refreshToken("123");
        assert.isNull(result);
    });

    it("should fail gracefully if asked to refresh a token that doesnt exist on user with existing tokens", () => {
        const tokenManager = new TokenManager();
        tokenManager.issueToken(dummyUser);
        const result = tokenManager.refreshToken("123");
        assert.isNull(result);
    });

    it("should refresh a token if the request is sunny day", () => {
        const tokenManager = new TokenManager();
        const candidateToken = tokenManager.issueToken(dummyUser);
        const oldExpires = candidateToken.expiresAt;
        const candidateRefreshedToken = tokenManager.refreshToken(candidateToken.token);

        assert.isNotNull(candidateRefreshedToken);
        assert.deepEqual(candidateToken, candidateRefreshedToken);
        assert.notStrictEqual(oldExpires, candidateRefreshedToken.expiresAt);
        assert.isTrue(candidateRefreshedToken.expiresAt.isSame(candidateRefreshedToken.grantedAt.clone().add(1, "h")));
    });

    it("should be unable of refreshing an already expired token", () => {
        const now = moment().utc();
        const tokenManagerAny: any = new TokenManager() as any;
        tokenManagerAny._tokenList = {
            "123": [{
                ownedBy: dummyUser,
                expiresAt: now.clone().add(-1, "h"),
                grantedAt: now.clone().add(-2, "h"),
                token: "123"
            }]
        };

        const tokenManager = tokenManagerAny as TokenManager;
        const result = tokenManager.refreshToken("123");
        assert.isNull(result);
    });
});

describe("Token manager isValidToken", () => {
    it("should return false if the user has no tokens yet", () => {
        const tokenManager = new TokenManager();
        assert.isFalse(tokenManager.isValidToken("123"));
    });

    it("should return false if the user has tokens but the token requested is not in the list", () => {
        const tokenManager = new TokenManager();
        tokenManager.issueToken(dummyUser);

        assert.isFalse(tokenManager.isValidToken("123"));
    });

    it("should return true if the token is valid in sunny day", () => {
        const tokenManager = new TokenManager();
        const token = tokenManager.issueToken(dummyUser);

        assert.isTrue(tokenManager.isValidToken(token.token));
    });

    it("should return false near exactly 1 hour of expiration", () => {
        const now = moment().utc().add(-1, "s");
        const tokenManagerAny: any = new TokenManager() as any;
        tokenManagerAny._tokenList = {};

        tokenManagerAny._tokenList["123"] = [{
            ownedBy: dummyUser,
            expiresAt: now,
            grantedAt: now.clone().add(-1, "h"),
            token: "123"
        }];

        const tokenManager = tokenManagerAny as TokenManager;
        assert.isFalse(tokenManager.isValidToken("123"));
    });

    it("should return true near exactly 1 hour of expiration", () => {
        const now = moment().utc().add(10, "s");
        const tokenManagerAny: any = new TokenManager() as any;
        tokenManagerAny._tokenList = {};

        tokenManagerAny._tokenList["123"] = [{
            ownedBy: dummyUser,
            expiresAt: now,
            grantedAt: now.clone().add(-1, "h"),
            token: "123"
        }];

        const tokenManager = tokenManagerAny as TokenManager;

        assert.isTrue(tokenManager.isValidToken("123"));
    });

    it("should return false for inputs of string arrays", () => {
        const tokenManager = new TokenManager();
        const token = tokenManager.issueToken(dummyUser);
        const tokenArray: string[] = [token.token];
        assert.isFalse(tokenManager.isValidToken(tokenArray as any));
    });
});