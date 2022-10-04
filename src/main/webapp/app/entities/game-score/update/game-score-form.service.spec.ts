import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../game-score.test-samples';

import { GameScoreFormService } from './game-score-form.service';

describe('GameScore Form Service', () => {
  let service: GameScoreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameScoreFormService);
  });

  describe('Service methods', () => {
    describe('createGameScoreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGameScoreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            gNo: expect.any(Object),
            playerScore1: expect.any(Object),
            playerScore2: expect.any(Object),
            playerScore3: expect.any(Object),
            playerScore4: expect.any(Object),
            createdDate: expect.any(Object),
            gameInfo: expect.any(Object),
          })
        );
      });

      it('passing IGameScore should create a new form with FormGroup', () => {
        const formGroup = service.createGameScoreFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            gNo: expect.any(Object),
            playerScore1: expect.any(Object),
            playerScore2: expect.any(Object),
            playerScore3: expect.any(Object),
            playerScore4: expect.any(Object),
            createdDate: expect.any(Object),
            gameInfo: expect.any(Object),
          })
        );
      });
    });

    describe('getGameScore', () => {
      it('should return NewGameScore for default GameScore initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGameScoreFormGroup(sampleWithNewData);

        const gameScore = service.getGameScore(formGroup) as any;

        expect(gameScore).toMatchObject(sampleWithNewData);
      });

      it('should return NewGameScore for empty GameScore initial value', () => {
        const formGroup = service.createGameScoreFormGroup();

        const gameScore = service.getGameScore(formGroup) as any;

        expect(gameScore).toMatchObject({});
      });

      it('should return IGameScore', () => {
        const formGroup = service.createGameScoreFormGroup(sampleWithRequiredData);

        const gameScore = service.getGameScore(formGroup) as any;

        expect(gameScore).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGameScore should not enable id FormControl', () => {
        const formGroup = service.createGameScoreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGameScore should disable id FormControl', () => {
        const formGroup = service.createGameScoreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
