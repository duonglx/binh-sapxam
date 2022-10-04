import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGameScore } from '../game-score.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../game-score.test-samples';

import { GameScoreService, RestGameScore } from './game-score.service';

const requireRestSample: RestGameScore = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
};

describe('GameScore Service', () => {
  let service: GameScoreService;
  let httpMock: HttpTestingController;
  let expectedResult: IGameScore | IGameScore[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GameScoreService);
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

    it('should create a GameScore', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const gameScore = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gameScore).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GameScore', () => {
      const gameScore = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gameScore).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GameScore', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GameScore', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GameScore', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGameScoreToCollectionIfMissing', () => {
      it('should add a GameScore to an empty array', () => {
        const gameScore: IGameScore = sampleWithRequiredData;
        expectedResult = service.addGameScoreToCollectionIfMissing([], gameScore);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gameScore);
      });

      it('should not add a GameScore to an array that contains it', () => {
        const gameScore: IGameScore = sampleWithRequiredData;
        const gameScoreCollection: IGameScore[] = [
          {
            ...gameScore,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGameScoreToCollectionIfMissing(gameScoreCollection, gameScore);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GameScore to an array that doesn't contain it", () => {
        const gameScore: IGameScore = sampleWithRequiredData;
        const gameScoreCollection: IGameScore[] = [sampleWithPartialData];
        expectedResult = service.addGameScoreToCollectionIfMissing(gameScoreCollection, gameScore);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gameScore);
      });

      it('should add only unique GameScore to an array', () => {
        const gameScoreArray: IGameScore[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gameScoreCollection: IGameScore[] = [sampleWithRequiredData];
        expectedResult = service.addGameScoreToCollectionIfMissing(gameScoreCollection, ...gameScoreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gameScore: IGameScore = sampleWithRequiredData;
        const gameScore2: IGameScore = sampleWithPartialData;
        expectedResult = service.addGameScoreToCollectionIfMissing([], gameScore, gameScore2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gameScore);
        expect(expectedResult).toContain(gameScore2);
      });

      it('should accept null and undefined values', () => {
        const gameScore: IGameScore = sampleWithRequiredData;
        expectedResult = service.addGameScoreToCollectionIfMissing([], null, gameScore, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gameScore);
      });

      it('should return initial array if no GameScore is added', () => {
        const gameScoreCollection: IGameScore[] = [sampleWithRequiredData];
        expectedResult = service.addGameScoreToCollectionIfMissing(gameScoreCollection, undefined, null);
        expect(expectedResult).toEqual(gameScoreCollection);
      });
    });

    describe('compareGameScore', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGameScore(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGameScore(entity1, entity2);
        const compareResult2 = service.compareGameScore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGameScore(entity1, entity2);
        const compareResult2 = service.compareGameScore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGameScore(entity1, entity2);
        const compareResult2 = service.compareGameScore(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
