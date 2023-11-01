import { IEducationPlace, NewEducationPlace } from './education-place.model';

export const sampleWithRequiredData: IEducationPlace = {
  id: 23860,
  placeName: 'at time oh',
};

export const sampleWithPartialData: IEducationPlace = {
  id: 20513,
  placeName: 'hard',
  city: 'Кинешма',
};

export const sampleWithFullData: IEducationPlace = {
  id: 13062,
  placeName: 'whoa',
  city: 'Белоярский',
};

export const sampleWithNewData: NewEducationPlace = {
  placeName: 'intern yuck oh',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
