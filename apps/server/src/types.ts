import { SessionUser } from '@/database/schema/users';

export type Result<T = unknown> = {
  message: string;
  status: number;
  payload?: T;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends SessionUser {}
  }
}
