import dayjs from 'dayjs/esm';

import { IGameScore, NewGameScore } from './game-score.model';

export const sampleWithRequiredData: IGameScore = {
  id: 51936,
};

export const sampleWithPartialData: IGameScore = {
  id: 77688,
  playerScore1: 36675,
  playerScore3: 94043,
  playerScore4: 32101,
  createdDate: dayjs('2022-10-03T15:22'),
};

export const sampleWithFullData: IGameScore = {
  id: 81125,
  playerScore1: 69372,
  playerScore2: 97996,
  playerScore3: 93812,
  playerScore4: 14249,
  createdDate: dayjs('2022-10-03T18:55'),
};

export const sampleWithNewData: NewGameScore = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
