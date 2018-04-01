/**
 * Third Party Library Imports
 */
import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from 'express-serve-static-core'
import { StudentHandler } from './StudentHandler';

/**
 * Internal Imports
 */
import { studentList } from './StudentList';
import { classList } from './ClassList';
import { Health } from './Health';
import { ClassHandler } from './ClassHandler';

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((request: Request, response: Response, next: any) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
    next();
});

app.use(bodyParser.json());

const hostedOnPort = 8194;
const studentHandler = new StudentHandler(studentList);
const classHanlder = new ClassHandler(classList);

/**
 * General health... 
 */
app.get('/', (req: Request, res: Response) => {
    res.send(Health.getHealth());
});

/**
 * Student(s) (GET)
 */
app.get('/students', studentHandler.handleGetList.bind(studentHandler));

/**
 * Student (GET,POST,PUT,DELETE)
 */
app.get('/student', studentHandler.handleGet.bind(studentHandler));
app.post('/student', studentHandler.handlePost.bind(studentHandler));
app.put('/student', studentHandler.handlePut.bind(studentHandler));
app.delete('/student', studentHandler.handleDelete.bind(studentHandler));

/**
 * Class (GET,)
 */
app.get('/class', classHanlder.handleGet.bind(classHanlder));
app.post('/class', classHanlder.handlePost.bind(classHanlder));
app.put('/class', classHanlder.handlePut.bind(classHanlder));

app.listen(hostedOnPort, () => {
    console.log(`Listening on port ${hostedOnPort}`);
});