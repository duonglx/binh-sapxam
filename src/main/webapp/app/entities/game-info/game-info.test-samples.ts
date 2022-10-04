import dayjs from 'dayjs/esm';

import { IGameInfo, NewGameInfo } from './game-info.model';

export const sampleWithRequiredData: IGameInfo = {
  id: 76097,
};

export const sampleWithPartialData: IGameInfo = {
  id: 2272,
  gDesc: 'Awesome',
  player2: 94397,
};

export const sampleWithFullData: IGameInfo = {
  id: 69324,
  gNo: 10942,
  gDatetime: dayjs('2022-10-03T09:40'),
  gDesc: 'mesh Canada',
  player1: 41957,
  player2: 40494,
  player3: 31239,
  player4: 52485,
  createdBy: 'Plastic',
  createdDate: dayjs('2022-10-03T08:38'),
};

export const sampleWithNewData: NewGameInfo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
