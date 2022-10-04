import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IGameScore } from 'app/entities/game-score/game-score.model';

export interface IGameInfo {
  id: number;
  gDatetime?: dayjs.Dayjs | null;
  gDesc?: string | null;
  playerName1?: string | null;
  playerName2?: string | null;
  playerName3?: string | null;
  playerName4?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  gameScore?: Pick<IGameScore, 'id' | 'gDesc'> | null;
}

export type NewGameInfo = Omit<IGameInfo, 'id'> & { id: null };
