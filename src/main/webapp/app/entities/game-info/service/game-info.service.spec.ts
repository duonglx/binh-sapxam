import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGameInfo } from '../game-info.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../game-info.test-samples';

import { GameInfoService, RestGameInfo } from './game-info.service';

const requireRestSample: RestGameInfo = {
  ...sampleWithRequiredData,
  gDatetime: sampleWithRequiredData.gDatetime?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
};

describe('GameInfo Service', () => {
  let service: GameInfoService;
  let httpMock: HttpTestingController;
  let expectedResult: IGameInfo | IGameInfo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GameInfoService);
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

    it('should create a GameInfo', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const gameInfo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gameInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GameInfo', () => {
      const gameInfo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gameInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GameInfo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GameInfo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GameInfo', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGameInfoToCollectionIfMissing', () => {
      it('should add a GameInfo to an empty array', () => {
        const gameInfo: IGameInfo = sampleWithRequiredData;
        expectedResult = service.addGameInfoToCollectionIfMissing([], gameInfo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gameInfo);
      });

      it('should not add a GameInfo to an array that contains it', () => {
        const gameInfo: IGameInfo = sampleWithRequiredData;
        const gameInfoCollection: IGameInfo[] = [
          {
            ...gameInfo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGameInfoToCollectionIfMissing(gameInfoCollection, gameInfo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GameInfo to an array that doesn't contain it", () => {
        const gameInfo: IGameInfo = sampleWithRequiredData;
        const gameInfoCollection: IGameInfo[] = [sampleWithPartialData];
        expectedResult = service.addGameInfoToCollectionIfMissing(gameInfoCollection, gameInfo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gameInfo);
      });

      it('should add only unique GameInfo to an array', () => {
        const gameInfoArray: IGameInfo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gameInfoCollection: IGameInfo[] = [sampleWithRequiredData];
        expectedResult = service.addGameInfoToCollectionIfMissing(gameInfoCollection, ...gameInfoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gameInfo: IGameInfo = sampleWithRequiredData;
        const gameInfo2: IGameInfo = sampleWithPartialData;
        expectedResult = service.addGameInfoToCollectionIfMissing([], gameInfo, gameInfo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gameInfo);
        expect(expectedResult).toContain(gameInfo2);
      });

      it('should accept null and undefined values', () => {
        const gameInfo: IGameInfo = sampleWithRequiredData;
        expectedResult = service.addGameInfoToCollectionIfMissing([], null, gameInfo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gameInfo);
      });

      it('should return initial array if no GameInfo is added', () => {
        const gameInfoCollection: IGameInfo[] = [sampleWithRequiredData];
        expectedResult = service.addGameInfoToCollectionIfMissing(gameInfoCollection, undefined, null);
        expect(expectedResult).toEqual(gameInfoCollection);
      });
    });

    describe('compareGameInfo', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGameInfo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGameInfo(entity1, entity2);
        const compareResult2 = service.compareGameInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGameInfo(entity1, entity2);
        const compareResult2 = service.compareGameInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGameInfo(entity1, entity2);
        const compareResult2 = service.compareGameInfo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
