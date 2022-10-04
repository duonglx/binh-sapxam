import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../game-info.test-samples';

import { GameInfoFormService } from './game-info-form.service';

describe('GameInfo Form Service', () => {
  let service: GameInfoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameInfoFormService);
  });

  describe('Service methods', () => {
    describe('createGameInfoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGameInfoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            gDatetime: expect.any(Object),
            gDesc: expect.any(Object),
            playerName1: expect.any(Object),
            playerName2: expect.any(Object),
            playerName3: expect.any(Object),
            playerName4: expect.any(Object),
            createdBy: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IGameInfo should create a new form with FormGroup', () => {
        const formGroup = service.createGameInfoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            gDatetime: expect.any(Object),
            gDesc: expect.any(Object),
            playerName1: expect.any(Object),
            playerName2: expect.any(Object),
            playerName3: expect.any(Object),
            playerName4: expect.any(Object),
            createdBy: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getGameInfo', () => {
      it('should return NewGameInfo for default GameInfo initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGameInfoFormGroup(sampleWithNewData);

        const gameInfo = service.getGameInfo(formGroup) as any;

        expect(gameInfo).toMatchObject(sampleWithNewData);
      });

      it('should return NewGameInfo for empty GameInfo initial value', () => {
        const formGroup = service.createGameInfoFormGroup();

        const gameInfo = service.getGameInfo(formGroup) as any;

        expect(gameInfo).toMatchObject({});
      });

      it('should return IGameInfo', () => {
        const formGroup = service.createGameInfoFormGroup(sampleWithRequiredData);

        const gameInfo = service.getGameInfo(formGroup) as any;

        expect(gameInfo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGameInfo should not enable id FormControl', () => {
        const formGroup = service.createGameInfoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGameInfo should disable id FormControl', () => {
        const formGroup = service.createGameInfoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
