import dayjs from 'dayjs/esm';

import { IGameScore, NewGameScore } from './game-score.model';

export const sampleWithRequiredData: IGameScore = {
  id: 51936,
};

export const sampleWithPartialData: IGameScore = {
  id: 36675,
  gNo: 94043,
  player2: 'Republic)',
  player3: 'Marketing Jewelery payment',
  player4: 'TCP alarm',
  createdDate: dayjs('2022-10-03T17:18'),
};

export const sampleWithFullData: IGameScore = {
  id: 69676,
  gNo: 17334,
  player1: 'Multi-channelled Kuwait',
  player2: 'Bike Franc',
  player3: 'SCSI invoice',
  player4: 'array maroon Handcrafted',
  createdDate: dayjs('2022-10-03T11:09'),
};

export const sampleWithNewData: NewGameScore = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
