export interface IEducationPlace {
  id: number;
  placeName?: string | null;
  city?: string | null;
}

export type NewEducationPlace = Omit<IEducationPlace, 'id'> & { id: null };
