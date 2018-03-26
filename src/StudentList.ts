import {Student} from './Student'

export const studentList: Student[] = [];

/**
 * TODO: attach to some kind of data store... in memory wont work for anything real
 */
studentList.push(new Student({ Id: 1, Name: 'Aiden Bax', Grade: 'K', ProfilePicture: '' }));
studentList.push(new Student({ Id: 2, Name: 'Kathrine Bax', Grade: '2', ProfilePicture: '' }));
studentList.push(new Student({ Id: 3, Name: 'Steven Smith', Grade: '3', ProfilePicture: '' }));
studentList.push(new Student({ Id: 4, Name: 'Jane Smith', Grade: '1', ProfilePicture: '' }));
studentList.push(new Student({ Id: 5, Name: 'Jack Sparrow', Grade: '4', ProfilePicture: '' }));