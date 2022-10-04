import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGameScore, NewGameScore } from '../game-score.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGameScore for edit and NewGameScoreFormGroupInput for create.
 */
type GameScoreFormGroupInput = IGameScore | PartialWithRequiredKeyOf<NewGameScore>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGameScore | NewGameScore> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

type GameScoreFormRawValue = FormValueOf<IGameScore>;

type NewGameScoreFormRawValue = FormValueOf<NewGameScore>;

type GameScoreFormDefaults = Pick<NewGameScore, 'id' | 'createdDate'>;

type GameScoreFormGroupContent = {
  id: FormControl<GameScoreFormRawValue['id'] | NewGameScore['id']>;
  gNo: FormControl<GameScoreFormRawValue['gNo']>;
  player1: FormControl<GameScoreFormRawValue['player1']>;
  player2: FormControl<GameScoreFormRawValue['player2']>;
  player3: FormControl<GameScoreFormRawValue['player3']>;
  player4: FormControl<GameScoreFormRawValue['player4']>;
  createdDate: FormControl<GameScoreFormRawValue['createdDate']>;
  gameInfo: FormControl<GameScoreFormRawValue['gameInfo']>;
};

export type GameScoreFormGroup = FormGroup<GameScoreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GameScoreFormService {
  createGameScoreFormGroup(gameScore: GameScoreFormGroupInput = { id: null }): GameScoreFormGroup {
    const gameScoreRawValue = this.convertGameScoreToGameScoreRawValue({
      ...this.getFormDefaults(),
      ...gameScore,
    });
    return new FormGroup<GameScoreFormGroupContent>({
      id: new FormControl(
        { value: gameScoreRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      gNo: new FormControl(gameScoreRawValue.gNo),
      player1: new FormControl(gameScoreRawValue.player1),
      player2: new FormControl(gameScoreRawValue.player2),
      player3: new FormControl(gameScoreRawValue.player3),
      player4: new FormControl(gameScoreRawValue.player4),
      createdDate: new FormControl(gameScoreRawValue.createdDate),
      gameInfo: new FormControl(gameScoreRawValue.gameInfo),
    });
  }

  getGameScore(form: GameScoreFormGroup): IGameScore | NewGameScore {
    return this.convertGameScoreRawValueToGameScore(form.getRawValue() as GameScoreFormRawValue | NewGameScoreFormRawValue);
  }

  resetForm(form: GameScoreFormGroup, gameScore: GameScoreFormGroupInput): void {
    const gameScoreRawValue = this.convertGameScoreToGameScoreRawValue({ ...this.getFormDefaults(), ...gameScore });
    form.reset(
      {
        ...gameScoreRawValue,
        id: { value: gameScoreRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GameScoreFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
    };
  }

  private convertGameScoreRawValueToGameScore(rawGameScore: GameScoreFormRawValue | NewGameScoreFormRawValue): IGameScore | NewGameScore {
    return {
      ...rawGameScore,
      createdDate: dayjs(rawGameScore.createdDate, DATE_TIME_FORMAT),
    };
  }

  private convertGameScoreToGameScoreRawValue(
    gameScore: IGameScore | (Partial<NewGameScore> & GameScoreFormDefaults)
  ): GameScoreFormRawValue | PartialWithRequiredKeyOf<NewGameScoreFormRawValue> {
    return {
      ...gameScore,
      createdDate: gameScore.createdDate ? gameScore.createdDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
