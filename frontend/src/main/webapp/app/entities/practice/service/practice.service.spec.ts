import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPractice } from '../practice.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../practice.test-samples';

import { PracticeService, RestPractice } from './practice.service';

const requireRestSample: RestPractice = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  endDate: sampleWithRequiredData.endDate?.toJSON(),
};

describe('Practice Service', () => {
  let service: PracticeService;
  let httpMock: HttpTestingController;
  let expectedResult: IPractice | IPractice[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PracticeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Practice', () => {
      const practice = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(practice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Practice', () => {
      const practice = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(practice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Practice', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Practice', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Practice', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPracticeToCollectionIfMissing', () => {
      it('should add a Practice to an empty array', () => {
        const practice: IPractice = sampleWithRequiredData;
        expectedResult = service.addPracticeToCollectionIfMissing([], practice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(practice);
      });

      it('should not add a Practice to an array that contains it', () => {
        const practice: IPractice = sampleWithRequiredData;
        const practiceCollection: IPractice[] = [
          {
            ...practice,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPracticeToCollectionIfMissing(practiceCollection, practice);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Practice to an array that doesn't contain it", () => {
        const practice: IPractice = sampleWithRequiredData;
        const practiceCollection: IPractice[] = [sampleWithPartialData];
        expectedResult = service.addPracticeToCollectionIfMissing(practiceCollection, practice);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(practice);
      });

      it('should add only unique Practice to an array', () => {
        const practiceArray: IPractice[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const practiceCollection: IPractice[] = [sampleWithRequiredData];
        expectedResult = service.addPracticeToCollectionIfMissing(practiceCollection, ...practiceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const practice: IPractice = sampleWithRequiredData;
        const practice2: IPractice = sampleWithPartialData;
        expectedResult = service.addPracticeToCollectionIfMissing([], practice, practice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(practice);
        expect(expectedResult).toContain(practice2);
      });

      it('should accept null and undefined values', () => {
        const practice: IPractice = sampleWithRequiredData;
        expectedResult = service.addPracticeToCollectionIfMissing([], null, practice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(practice);
      });

      it('should return initial array if no Practice is added', () => {
        const practiceCollection: IPractice[] = [sampleWithRequiredData];
        expectedResult = service.addPracticeToCollectionIfMissing(practiceCollection, undefined, null);
        expect(expectedResult).toEqual(practiceCollection);
      });
    });

    describe('comparePractice', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePractice(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePractice(entity1, entity2);
        const compareResult2 = service.comparePractice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePractice(entity1, entity2);
        const compareResult2 = service.comparePractice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePractice(entity1, entity2);
        const compareResult2 = service.comparePractice(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
