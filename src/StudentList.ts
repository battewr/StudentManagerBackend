import {Student} from './Student'

export const studentList: Student[] = [];

/**
 * TODO: attach to some kind of data store... in memory wont work for anything real
 */
studentList.push(new Student({ Id: "1Eda3", Name: 'John Smith', Grade: 'K', ProfilePicture: '' }));
studentList.push(new Student({ Id: "130Ek", Name: 'Katie Frank', Grade: '2', ProfilePicture: '' }));
studentList.push(new Student({ Id: "93kam", Name: 'Steven Smith', Grade: '3', ProfilePicture: '' }));
studentList.push(new Student({ Id: "ka93K", Name: 'Jane Smith', Grade: '1', ProfilePicture: '' }));
studentList.push(new Student({ Id: "56Ifj", Name: 'Jack Sparrow', Grade: '4', ProfilePicture: '' }));