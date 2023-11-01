import dayjs from 'dayjs/esm';
import { IEducationPlace } from 'app/entities/education-place/education-place.model';

export interface IStudent {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  studyStart?: dayjs.Dayjs | null;
  studyEnd?: dayjs.Dayjs | null;
  educationPlace?: Pick<IEducationPlace, 'id'> | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
