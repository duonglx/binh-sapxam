import dayjs from 'dayjs/esm';
import { IGameInfo } from 'app/entities/game-info/game-info.model';

export interface IGameScore {
  id: number;
  gNo?: number | null;
  player1?: string | null;
  player2?: string | null;
  player3?: string | null;
  player4?: string | null;
  createdDate?: dayjs.Dayjs | null;
  gameInfo?: Pick<IGameInfo, 'id'> | null;
}

export type NewGameScore = Omit<IGameScore, 'id'> & { id: null };
