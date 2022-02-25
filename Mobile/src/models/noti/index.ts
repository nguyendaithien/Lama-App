import { IDevice } from '../device';

export type INoti = {
  id?: number;
  title?: string;
  imageUrl?: string;
  body?: string;
  isSeen?: number;
  createdAt?: string;
  node?: IDevice;
};
