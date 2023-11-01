import dayjs from 'dayjs/esm';

import { IPractice, NewPractice } from './practice.model';

export const sampleWithRequiredData: IPractice = {
  id: 23844,
  companyName: 'firsthand',
  startDate: dayjs('2023-11-01T02:36'),
};

export const sampleWithPartialData: IPractice = {
  id: 2965,
  companyName: 'actually',
  studentName: 'searchingly locomotive',
  startDate: dayjs('2023-10-31T19:16'),
};

export const sampleWithFullData: IPractice = {
  id: 20757,
  companyName: 'pupate fatally simplicity',
  studentName: 'realistic upon',
  startDate: dayjs('2023-10-31T16:26'),
  endDate: dayjs('2023-10-31T10:26'),
  tasks: 'meh intently boo',
};

export const sampleWithNewData: NewPractice = {
  companyName: 'sturdy which after',
  startDate: dayjs('2023-10-31T14:36'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
