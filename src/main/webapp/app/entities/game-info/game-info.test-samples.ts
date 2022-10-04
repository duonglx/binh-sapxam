import dayjs from 'dayjs/esm';

import { IGameInfo, NewGameInfo } from './game-info.model';

export const sampleWithRequiredData: IGameInfo = {
  id: 76097,
};

export const sampleWithPartialData: IGameInfo = {
  id: 2272,
  gDesc: 'Awesome',
  player2: 'boliviano Keys salmon',
};

export const sampleWithFullData: IGameInfo = {
  id: 97826,
  gNo: 41957,
  gDatetime: dayjs('2022-10-03T18:27'),
  gDesc: 'Czech',
  player1: 'parallelism',
  player2: 'Practical demand-driven Fish',
  player3: 'Buckinghamshire bus Gorgeous',
  player4: 'Lempira Soap',
  createdBy: 'Portugal RSS Avon',
  createdDate: dayjs('2022-10-03T14:50'),
};

export const sampleWithNewData: NewGameInfo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
