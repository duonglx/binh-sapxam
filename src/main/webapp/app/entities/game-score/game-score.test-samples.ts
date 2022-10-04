import dayjs from 'dayjs/esm';

import { IGameScore, NewGameScore } from './game-score.model';

export const sampleWithRequiredData: IGameScore = {
  id: 51936,
};

export const sampleWithPartialData: IGameScore = {
  id: 36675,
  gNo: 94043,
  playerScore2: 32101,
  playerScore3: 53350,
  playerScore4: 81125,
  createdDate: dayjs('2022-10-03T11:31'),
};

export const sampleWithFullData: IGameScore = {
  id: 97996,
  gNo: 93812,
  playerScore1: 14249,
  playerScore2: 38527,
  playerScore3: 807,
  playerScore4: 81235,
  createdDate: dayjs('2022-10-03T04:59'),
};

export const sampleWithNewData: NewGameScore = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
