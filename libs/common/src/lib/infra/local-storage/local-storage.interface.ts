import { ClsStore } from 'nestjs-cls';
import { IAuthUser } from '../../interface';

export interface ILocalStorage extends ClsStore {
  user: IAuthUser | null;
  token: string | null;
}
