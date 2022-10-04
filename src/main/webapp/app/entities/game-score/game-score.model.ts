import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IGameScore {
  id: number;
  playerScore1?: number | null;
  playerScore2?: number | null;
  playerScore3?: number | null;
  playerScore4?: number | null;
  createdDate?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewGameScore = Omit<IGameScore, 'id'> & { id: null };
