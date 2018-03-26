/**
 * Third Party Library Imports
 */
import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from 'express-serve-static-core'

/**
 * Internal Imports
 */
import {studentList} from './StudentList';

debugger;

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

const hostedOnPort = 8194;


app.get('/', (req: Request, res: Response) => {
    res.send('Ok Plus!');
});

app.get('/student', (req: Request, res: Response) => {
    const id: number = parseInt(req.query.id, 10);
    if (!id) {
        res.sendStatus(404);
        return;
    }
    const index = studentList.findIndex((target) => {
        if (target.getId() === id) {
            return true;
        }
        return false;
    });
    if (index < 0) {
        res.sendStatus(404);
        return;
    }

    res.send(studentList[index]);
});

app.post('/student', (req: Request, res: Response) => {
    const body = req.body;

    if (!body) {
        res.sendStatus(500);
        return;
    }

    studentList.push(body);
    res.send('Created!');
});

app.listen(hostedOnPort, () => {
    console.log(`Listening on port ${hostedOnPort}`);
});