import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IGameInfo {
  id: number;
  gDatetime?: dayjs.Dayjs | null;
  gDesc?: string | null;
  playerName1?: string | null;
  playerName2?: string | null;
  playerName3?: string | null;
  playerName4?: string | null;
  createdBy?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewGameInfo = Omit<IGameInfo, 'id'> & { id: null };
