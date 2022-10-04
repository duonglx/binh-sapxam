import dayjs from 'dayjs/esm';

export interface IGameInfo {
  id: number;
  gNo?: number | null;
  gDatetime?: dayjs.Dayjs | null;
  gDesc?: string | null;
  player1?: string | null;
  player2?: string | null;
  player3?: string | null;
  player4?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
}

export type NewGameInfo = Omit<IGameInfo, 'id'> & { id: null };
