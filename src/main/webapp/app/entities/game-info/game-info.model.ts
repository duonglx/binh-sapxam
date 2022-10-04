import dayjs from 'dayjs/esm';

export interface IGameInfo {
  id: number;
  gNo?: number | null;
  gDatetime?: dayjs.Dayjs | null;
  gDesc?: string | null;
  player1?: number | null;
  player2?: number | null;
  player3?: number | null;
  player4?: number | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
}

export type NewGameInfo = Omit<IGameInfo, 'id'> & { id: null };
