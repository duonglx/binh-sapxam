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
  playerScore1: FormControl<GameScoreFormRawValue['playerScore1']>;
  playerScore2: FormControl<GameScoreFormRawValue['playerScore2']>;
  playerScore3: FormControl<GameScoreFormRawValue['playerScore3']>;
  playerScore4: FormControl<GameScoreFormRawValue['playerScore4']>;
  createdDate: FormControl<GameScoreFormRawValue['createdDate']>;
  user: FormControl<GameScoreFormRawValue['user']>;
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
      playerScore1: new FormControl(gameScoreRawValue.playerScore1, {
        validators: [Validators.min(-50), Validators.max(50)],
      }),
      playerScore2: new FormControl(gameScoreRawValue.playerScore2, {
        validators: [Validators.min(2), Validators.max(3)],
      }),
      playerScore3: new FormControl(gameScoreRawValue.playerScore3, {
        validators: [Validators.min(2), Validators.max(3)],
      }),
      playerScore4: new FormControl(gameScoreRawValue.playerScore4, {
        validators: [Validators.min(2), Validators.max(3)],
      }),
      createdDate: new FormControl(gameScoreRawValue.createdDate, {
        validators: [Validators.required],
      }),
      user: new FormControl(gameScoreRawValue.user, {
        validators: [Validators.required],
      }),
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
