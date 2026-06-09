import { UserRole } from '../enum';

export interface IUserAuth {
  sub: string;
  name: string;
  email: string;
  role: string | UserRole | { name: string };
}
