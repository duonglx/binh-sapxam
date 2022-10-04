import dayjs from 'dayjs/esm';

import { IGameScore, NewGameScore } from './game-score.model';

export const sampleWithRequiredData: IGameScore = {
  id: 51936,
  createdDate: dayjs('2022-10-03T07:56'),
};

export const sampleWithPartialData: IGameScore = {
  id: 77688,
  playerScore2: 2,
  playerScore3: 3,
  playerScore4: 2,
  createdDate: dayjs('2022-10-03T15:22'),
};

export const sampleWithFullData: IGameScore = {
  id: 81125,
  playerScore1: 3,
  playerScore2: 3,
  playerScore3: 3,
  playerScore4: 2,
  createdDate: dayjs('2022-10-03T18:55'),
};

export const sampleWithNewData: NewGameScore = {
  createdDate: dayjs('2022-10-04T03:59'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
