import { ICompany, NewCompany } from './company.model';

export const sampleWithRequiredData: ICompany = {
  id: 10136,
  companyName: 'lilac ordinary',
};

export const sampleWithPartialData: ICompany = {
  id: 26783,
  companyName: 'hence',
  location: 'deconstruct',
};

export const sampleWithFullData: ICompany = {
  id: 20458,
  companyName: 'why fairly valiantly',
  location: 'update',
};

export const sampleWithNewData: NewCompany = {
  companyName: 'arctic seemingly zowie',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
