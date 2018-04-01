import {Class} from './Class'

export const classList: Class[] = [];

/**
 * TODO: attach to some kind of data store... in memory wont work for anything real
 */
classList.push(new Class({ Id: '1ErdJ', Name: 'A1 Grade 1', Semester: "Spring", Year: "2018" }));
classList.push(new Class({ Id: '1EldJ', Name: 'B1 Grade 1', Semester: "Spring", Year: "2018" }));
classList.push(new Class({ Id: '1EmdJ', Name: 'A1 Grade 2', Semester: "Spring", Year: "2018" }));
classList.push(new Class({ Id: '1ExdJ', Name: 'A1 Grade 1', Semester: "Fall", Year: "2018" }));