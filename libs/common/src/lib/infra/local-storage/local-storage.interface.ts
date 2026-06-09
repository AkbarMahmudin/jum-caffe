import { ClsStore } from 'nestjs-cls';
import { IUserAuth } from '../../interface';

export interface ILocalStorage extends ClsStore {
  user: IUserAuth | null;
  token: string | null;
}
