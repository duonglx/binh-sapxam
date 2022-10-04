import dayjs from 'dayjs/esm';

import { IGameInfo, NewGameInfo } from './game-info.model';

export const sampleWithRequiredData: IGameInfo = {
  id: 76097,
  gDatetime: dayjs('2022-10-03T18:50'),
  gDesc: 'Avon',
};

export const sampleWithPartialData: IGameInfo = {
  id: 2272,
  gDatetime: dayjs('2022-10-04T02:50'),
  gDesc: 'Montana',
};

export const sampleWithFullData: IGameInfo = {
  id: 69324,
  gDatetime: dayjs('2022-10-04T01:33'),
  gDesc: 'Keys salmon Administrator',
  playerName1: 'Czech',
  playerName2: 'parallelism',
  playerName3: 'Practical demand-driven Fish',
  playerName4: 'Buckinghamshire bus Gorgeous',
};

export const sampleWithNewData: NewGameInfo = {
  gDatetime: dayjs('2022-10-03T17:22'),
  gDesc: 'firmware Account Portugal',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
