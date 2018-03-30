/**
 * Third Party Library Imports
 */
import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from 'express-serve-static-core'
import { StudentRestHandler } from './StudentRestHandler';

/**
 * Internal Imports
 */
import { studentList } from './StudentList';
import { Health } from './Health';

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((request: Request, response: Response, next: any) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

const hostedOnPort = 8194;
const studentHandler = new StudentRestHandler(studentList);

/**
 * General health... 
 */
app.get('/', (req: Request, res: Response) => {
    res.send(Health.getHealth());
});


app.get('/student', studentHandler.handleGet.bind(studentHandler));
app.get('/students', studentHandler.handleGetList.bind(studentHandler));
app.post('/student', studentHandler.handlePost.bind(studentHandler));
app.delete('/student', studentHandler.handleDelete.bind(studentHandler));

app.listen(hostedOnPort, () => {
    console.log(`Listening on port ${hostedOnPort}`);
});