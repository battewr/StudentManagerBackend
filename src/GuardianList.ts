import { Guardian } from "./Guardian";

export const guardianList: Guardian[] = [];

/**
 * TODO: attach to some kind of data store... in memory wont work for anything real
 */
guardianList.push(new Guardian({ Id: "G1", Name: "Max Smith", Email: "msmith@hotmail.com" }));
guardianList.push(new Guardian({ Id: "G2", Name: "Amanda Jane", Email: "ajane@microsoft.com" }));
guardianList.push(new Guardian({ Id: "G3", Name: "Steve Woz", Email: "swoz@msn.com" }));
guardianList.push(new Guardian({ Id: "G4", Name: "Dan Zel", Email: "dzel@visualstudio.net" }));
guardianList.push(new Guardian({ Id: "G5", Name: "The Superman", Email: "superman@superman.com" }));
