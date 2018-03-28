export class Health {
    public static getHealth(): string {
        return JSON.stringify({state: "Online"});
    }
};
