import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 27172,
  email: 'Leontii75@yahoo.com',
  studyStart: dayjs('2023-10-31T19:16'),
};

export const sampleWithPartialData: IStudent = {
  id: 31817,
  lastName: 'Hilll',
  email: 'Ekaterina17@hotmail.com',
  phoneNumber: 'drat glean',
  studyStart: dayjs('2023-10-31T15:34'),
};

export const sampleWithFullData: IStudent = {
  id: 16288,
  firstName: 'Аркадий',
  lastName: 'Rodriguez',
  email: 'Larisa.Armstrong@yahoo.com',
  phoneNumber: 'though solemnly generally',
  studyStart: dayjs('2023-11-01T01:32'),
  studyEnd: dayjs('2023-10-31T19:46'),
};

export const sampleWithNewData: NewStudent = {
  email: 'Evfrosiniya_Borer26@yahoo.com',
  studyStart: dayjs('2023-10-31T20:37'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
