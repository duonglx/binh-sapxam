import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGameInfo, NewGameInfo } from '../game-info.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGameInfo for edit and NewGameInfoFormGroupInput for create.
 */
type GameInfoFormGroupInput = IGameInfo | PartialWithRequiredKeyOf<NewGameInfo>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGameInfo | NewGameInfo> = Omit<T, 'gDatetime'> & {
  gDatetime?: string | null;
};

type GameInfoFormRawValue = FormValueOf<IGameInfo>;

type NewGameInfoFormRawValue = FormValueOf<NewGameInfo>;

type GameInfoFormDefaults = Pick<NewGameInfo, 'id' | 'gDatetime'>;

type GameInfoFormGroupContent = {
  id: FormControl<GameInfoFormRawValue['id'] | NewGameInfo['id']>;
  gDatetime: FormControl<GameInfoFormRawValue['gDatetime']>;
  gDesc: FormControl<GameInfoFormRawValue['gDesc']>;
  playerName1: FormControl<GameInfoFormRawValue['playerName1']>;
  playerName2: FormControl<GameInfoFormRawValue['playerName2']>;
  playerName3: FormControl<GameInfoFormRawValue['playerName3']>;
  playerName4: FormControl<GameInfoFormRawValue['playerName4']>;
  user: FormControl<GameInfoFormRawValue['user']>;
};

export type GameInfoFormGroup = FormGroup<GameInfoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GameInfoFormService {
  createGameInfoFormGroup(gameInfo: GameInfoFormGroupInput = { id: null }): GameInfoFormGroup {
    const gameInfoRawValue = this.convertGameInfoToGameInfoRawValue({
      ...this.getFormDefaults(),
      ...gameInfo,
    });
    return new FormGroup<GameInfoFormGroupContent>({
      id: new FormControl(
        { value: gameInfoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      gDatetime: new FormControl(gameInfoRawValue.gDatetime, {
        validators: [Validators.required],
      }),
      gDesc: new FormControl(gameInfoRawValue.gDesc, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      playerName1: new FormControl(gameInfoRawValue.playerName1),
      playerName2: new FormControl(gameInfoRawValue.playerName2),
      playerName3: new FormControl(gameInfoRawValue.playerName3),
      playerName4: new FormControl(gameInfoRawValue.playerName4),
      user: new FormControl(gameInfoRawValue.user, {
        validators: [Validators.required],
      }),
    });
  }

  getGameInfo(form: GameInfoFormGroup): IGameInfo | NewGameInfo {
    return this.convertGameInfoRawValueToGameInfo(form.getRawValue() as GameInfoFormRawValue | NewGameInfoFormRawValue);
  }

  resetForm(form: GameInfoFormGroup, gameInfo: GameInfoFormGroupInput): void {
    const gameInfoRawValue = this.convertGameInfoToGameInfoRawValue({ ...this.getFormDefaults(), ...gameInfo });
    form.reset(
      {
        ...gameInfoRawValue,
        id: { value: gameInfoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GameInfoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      gDatetime: currentTime,
    };
  }

  private convertGameInfoRawValueToGameInfo(rawGameInfo: GameInfoFormRawValue | NewGameInfoFormRawValue): IGameInfo | NewGameInfo {
    return {
      ...rawGameInfo,
      gDatetime: dayjs(rawGameInfo.gDatetime, DATE_TIME_FORMAT),
    };
  }

  private convertGameInfoToGameInfoRawValue(
    gameInfo: IGameInfo | (Partial<NewGameInfo> & GameInfoFormDefaults)
  ): GameInfoFormRawValue | PartialWithRequiredKeyOf<NewGameInfoFormRawValue> {
    return {
      ...gameInfo,
      gDatetime: gameInfo.gDatetime ? gameInfo.gDatetime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
