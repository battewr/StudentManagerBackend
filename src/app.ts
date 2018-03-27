/**
 * Third Party Library Imports
 */
import express from 'express';
import bodyParser from 'body-parser';
import { StudentRestHandler } from './StudentRestHandler';

/**
 * Internal Imports
 */
import { studentList } from './StudentList';

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

const hostedOnPort = 8194;
const studentHandler = new StudentRestHandler(studentList);

/**
 * TODO: turn / into a sort of health check page for monitoring
 */
// app.get('/', (req: Request, res: Response) => {
//     res.send('Ok Plus!');
// });


app.get('/student', studentHandler.handleGet.bind(studentHandler));
app.post('/student', studentHandler.handlePost.bind(studentHandler));
app.delete('/student', studentHandler.handleDelete.bind(studentHandler));

app.listen(hostedOnPort, () => {
    console.log(`Listening on port ${hostedOnPort}`);
});