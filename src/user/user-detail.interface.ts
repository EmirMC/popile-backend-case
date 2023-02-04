import { Types } from 'mongoose';

export interface UserDetail {
  id: Types.ObjectId;
  email: string;
  username: string;
}
