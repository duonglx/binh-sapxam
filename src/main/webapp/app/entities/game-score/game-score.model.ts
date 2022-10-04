import dayjs from 'dayjs/esm';
import { IGameInfo } from 'app/entities/game-info/game-info.model';

export interface IGameScore {
  id: number;
  gNo?: number | null;
  playerScore1?: number | null;
  playerScore2?: number | null;
  playerScore3?: number | null;
  playerScore4?: number | null;
  createdDate?: dayjs.Dayjs | null;
  gameInfo?: Pick<IGameInfo, 'id'> | null;
}

export type NewGameScore = Omit<IGameScore, 'id'> & { id: null };
