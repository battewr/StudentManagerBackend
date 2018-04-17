/**
 * Third Party Library Imports
 */
import express from "express";
import https from "https";
import http from "http";
import fs from "fs";
import bodyParser from "body-parser";
import { Request, Response } from "express-serve-static-core";
import { StudentHandler } from "./Handlers/StudentHandler";

/**
 * Internal Imports
 */
import { studentList } from "./StudentList";
import { classList } from "./ClassList";
import { guardianList } from "./GuardianList";

import { MapSeedClassroomAssignments, MapSeedGuardianAssignments } from "./JoinTableSeeder";

import { Health } from "./Health";
import { ClassHandler } from "./Handlers/ClassHandler";
import { AttendenceHandler } from "./Handlers/AttendenceHandler";
import { EligibilityHanlder } from "./Handlers/EligibilityHandler";
import { GuardianHandler } from "./Handlers/GuardianHandler";
import { AssignHandler } from "./Handlers/AssignHandler";
import { LoginHandler } from "./Handlers/LoginHandler";
import { TokenManager } from "./Security/TokenManager";

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((request: Request, response: Response, next: any) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, sm-authorization-header");
    response.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    next();
});

app.use(bodyParser.json());

app.use((request: Request, response: Response, next: any) => {
    if (request.method.toLocaleLowerCase() === "options") {
        next();
        return;
    }

    if (request.path !== "/" &&
        request.path !== "/login" &&
        request.path !== "/registerGuardian") {
        if (!request.headers.hasOwnProperty("sm-authorization-header")) {
            response.sendStatus(401);
            return;
        }

        const headerValue = request.headers["sm-authorization-header"];
        if (!tokenManager.isValidToken(headerValue as string)) {
            response.sendStatus(401);
            return;
        }

        tokenManager.refreshToken(headerValue as string);
    }
    next();
});

const hostedOnPort = 8194;

const students = studentList;
const classes = classList;

MapSeedClassroomAssignments(classes, students);
MapSeedGuardianAssignments(guardianList, studentList);

const studentHandler = new StudentHandler(students, classes);
const classHanlder = new ClassHandler(classes);
const guardianHandler = new GuardianHandler(guardianList);
const attendenceHandler = new AttendenceHandler(classes, students);
const assignHandler = new AssignHandler(guardianList, studentList);
const eligibility = new EligibilityHanlder(classes, students);


const tokenManager = new TokenManager();
const loginHandler = new LoginHandler(tokenManager);

/**
 * General health...
 */
app.get("/", (req: Request, res: Response) => {
    res.send(Health.getHealth());
});

app.post("/login", loginHandler.handlePost.bind(loginHandler));
app.post("/registerGuardian", loginHandler.handleRegisterGuardian.bind(loginHandler));
app.get("/sc", loginHandler.handleGetSecurityContext.bind(loginHandler));

/**
 * Student(s) (GET)
 */
app.get("/students", studentHandler.handleGetList.bind(studentHandler));

/**
 * Student (GET,POST,PUT,DELETE)
 */
app.get("/student", studentHandler.handleGet.bind(studentHandler));
app.post("/student", studentHandler.handlePost.bind(studentHandler));
app.put("/student", studentHandler.handlePut.bind(studentHandler));
app.delete("/student", studentHandler.handleDelete.bind(studentHandler));

/**
 * Class (GET,)
 */
app.get("/class", classHanlder.handleGet.bind(classHanlder));
app.post("/class", classHanlder.handlePost.bind(classHanlder));
app.put("/class", classHanlder.handlePut.bind(classHanlder));
app.delete("/class", classHanlder.handleDelete.bind(classHanlder));

/**
 * attendence class to student association (put, delete)
 */
app.put("/attendence", attendenceHandler.handlePut.bind(attendenceHandler));
app.delete("/attendence", attendenceHandler.handleDelete.bind(attendenceHandler));

app.get("/eligibility", eligibility.handleGet.bind(eligibility));

/**
 * Guardians (GET,)
 */
app.get("/guardian", guardianHandler.handleGet.bind(guardianHandler));
app.post("/guardian", guardianHandler.handlePost.bind(guardianHandler));
app.put("/guardian", guardianHandler.handlePut.bind(guardianHandler));
app.delete("/guardian", guardianHandler.handleDelete.bind(guardianHandler));

/**
 * Guardian to Child Assignment
 */
app.put("/assign", assignHandler.handlePut.bind(assignHandler));
app.delete("/assign", assignHandler.handleDelete.bind(assignHandler));

const privateKey = fs.readFileSync("selfcert/private.pem", "utf8");
const certificate = fs.readFileSync("selfcert/public.pem", "utf8");

console.log("Certs Loaded... spawning server");
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);

httpsServer.listen(hostedOnPort, () => {
    console.log(`Listening on SSL port ${hostedOnPort}`);
});

httpServer.listen(hostedOnPort - 1, () => {
    console.log(`Listening on port ${hostedOnPort - 1}`);
});