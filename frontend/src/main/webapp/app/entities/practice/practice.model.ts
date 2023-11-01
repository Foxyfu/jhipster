import dayjs from 'dayjs/esm';
import { IStudent } from 'app/entities/student/student.model';
import { ICompany } from 'app/entities/company/company.model';

export interface IPractice {
  id: number;
  companyName?: string | null;
  studentName?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  tasks?: string | null;
  student?: Pick<IStudent, 'id'> | null;
  company?: Pick<ICompany, 'id'> | null;
}

export type NewPractice = Omit<IPractice, 'id'> & { id: null };
