import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 7813,
};

export const sampleWithPartialData: IEmployee = {
  id: 94038,
  lastName: 'Parisian',
  email: 'Jessy.Zulauf@yahoo.com',
  hireDate: dayjs('2022-10-04T02:43'),
  commissionPct: 14006,
};

export const sampleWithFullData: IEmployee = {
  id: 50464,
  firstName: 'Zechariah',
  lastName: 'Jakubowski',
  email: 'Sage97@gmail.com',
  phoneNumber: 'Kyrgyz',
  hireDate: dayjs('2022-10-03T05:42'),
  salary: 20712,
  commissionPct: 36931,
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
