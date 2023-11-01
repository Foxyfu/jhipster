export interface ICompany {
  id: number;
  companyName?: string | null;
  location?: string | null;
}

export type NewCompany = Omit<ICompany, 'id'> & { id: null };
