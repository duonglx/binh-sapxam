import dayjs from 'dayjs/esm';

import { IGameInfo, NewGameInfo } from './game-info.model';

export const sampleWithRequiredData: IGameInfo = {
  id: 76097,
};

export const sampleWithPartialData: IGameInfo = {
  id: 25027,
  playerName1: 'Movies Montana',
  playerName3: 'Licensed mesh Canada',
};

export const sampleWithFullData: IGameInfo = {
  id: 41957,
  gDatetime: dayjs('2022-10-03T18:27'),
  gDesc: 'Czech',
  playerName1: 'parallelism',
  playerName2: 'Practical demand-driven Fish',
  playerName3: 'Buckinghamshire bus Gorgeous',
  playerName4: 'Lempira Soap',
  createdBy: 'Portugal RSS Avon',
};

export const sampleWithNewData: NewGameInfo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
