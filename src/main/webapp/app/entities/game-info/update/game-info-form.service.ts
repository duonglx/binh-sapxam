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
type FormValueOf<T extends IGameInfo | NewGameInfo> = Omit<T, 'gDatetime' | 'createdDate'> & {
  gDatetime?: string | null;
  createdDate?: string | null;
};

type GameInfoFormRawValue = FormValueOf<IGameInfo>;

type NewGameInfoFormRawValue = FormValueOf<NewGameInfo>;

type GameInfoFormDefaults = Pick<NewGameInfo, 'id' | 'gDatetime' | 'createdDate'>;

type GameInfoFormGroupContent = {
  id: FormControl<GameInfoFormRawValue['id'] | NewGameInfo['id']>;
  gNo: FormControl<GameInfoFormRawValue['gNo']>;
  gDatetime: FormControl<GameInfoFormRawValue['gDatetime']>;
  gDesc: FormControl<GameInfoFormRawValue['gDesc']>;
  player1: FormControl<GameInfoFormRawValue['player1']>;
  player2: FormControl<GameInfoFormRawValue['player2']>;
  player3: FormControl<GameInfoFormRawValue['player3']>;
  player4: FormControl<GameInfoFormRawValue['player4']>;
  createdBy: FormControl<GameInfoFormRawValue['createdBy']>;
  createdDate: FormControl<GameInfoFormRawValue['createdDate']>;
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
      gNo: new FormControl(gameInfoRawValue.gNo),
      gDatetime: new FormControl(gameInfoRawValue.gDatetime),
      gDesc: new FormControl(gameInfoRawValue.gDesc),
      player1: new FormControl(gameInfoRawValue.player1),
      player2: new FormControl(gameInfoRawValue.player2),
      player3: new FormControl(gameInfoRawValue.player3),
      player4: new FormControl(gameInfoRawValue.player4),
      createdBy: new FormControl(gameInfoRawValue.createdBy),
      createdDate: new FormControl(gameInfoRawValue.createdDate),
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
      createdDate: currentTime,
    };
  }

  private convertGameInfoRawValueToGameInfo(rawGameInfo: GameInfoFormRawValue | NewGameInfoFormRawValue): IGameInfo | NewGameInfo {
    return {
      ...rawGameInfo,
      gDatetime: dayjs(rawGameInfo.gDatetime, DATE_TIME_FORMAT),
      createdDate: dayjs(rawGameInfo.createdDate, DATE_TIME_FORMAT),
    };
  }

  private convertGameInfoToGameInfoRawValue(
    gameInfo: IGameInfo | (Partial<NewGameInfo> & GameInfoFormDefaults)
  ): GameInfoFormRawValue | PartialWithRequiredKeyOf<NewGameInfoFormRawValue> {
    return {
      ...gameInfo,
      gDatetime: gameInfo.gDatetime ? gameInfo.gDatetime.format(DATE_TIME_FORMAT) : undefined,
      createdDate: gameInfo.createdDate ? gameInfo.createdDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
